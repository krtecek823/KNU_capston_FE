(function () {
  const CONFIG = {
    ingestionApi: window.HOVER_INGESTION_API || 'http://localhost:4000/events',
    decisionApi: window.HOVER_DECISION_API || 'http://localhost:4001/decision',
    debug: window.HOVER_DEBUG === true,
  };

  const FALLBACK_WIDGETS = {
    S1: {
      type: 'coupon_modal',
      data: {
        hotel_name: 'HoverStay',
        room_name: 'Selected room',
        discount_percent: 5,
        cta_text: 'Apply coupon',
      },
    },
    S2: {
      type: 'price_match_banner',
      data: {
        hotel_name: 'HoverStay',
        price_diff: 12000,
        cta_text: 'Continue booking',
      },
    },
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function sdkBasePath() {
    const current = document.currentScript && document.currentScript.src;
    if (!current) return '../';
    return new URL('../', current).href;
  }

  function inferHotelContext() {
    const title = document.querySelector('h1')?.textContent?.trim() || document.title || 'HoverStay';
    const priceText = document.body.textContent.match(/KRW|₩\s?[\d,]+/)?.[0] || '';
    const selectedCopy = document.querySelector('[data-hover-copy]')?.getAttribute('data-hover-copy') || '';
    return {
      hotel_name: title.replace(/\s+/g, ' ').slice(0, 80),
      room_name: selectedCopy || 'Selected room',
      price_text: priceText,
    };
  }

  function mockDecisionScenario() {
    const params = new URLSearchParams(location.search);
    const value = params.get('mockDecision');
    if (!value) return null;
    const normalized = value.toLowerCase();
    if (normalized === 'banner' || normalized === 'price' || normalized === 's2') return 'S2';
    return 'S1';
  }

  function createMockDecision(scenarioId) {
    const widget = JSON.parse(JSON.stringify(FALLBACK_WIDGETS[scenarioId] || FALLBACK_WIDGETS.S1));
    widget.data = Object.assign(widget.data, inferHotelContext(), {
      title: scenarioId === 'S2' ? 'Mock best-price banner' : 'Mock coupon modal',
      body: scenarioId === 'S2'
        ? 'Decision API is not running, so this banner is rendered by mock decision mode.'
        : 'Decision API is not running, so this coupon modal is rendered by mock decision mode.',
    });
    return {
      intervention_id: `mock-${scenarioId.toLowerCase()}-${Date.now()}`,
      session_id: window.hover?.getSessionId ? window.hover.getSessionId() : 'mock-session',
      scenario_id: scenarioId,
      ab_group: 'treatment',
      widgets: [widget],
    };
  }

  function renderDecision(decision, tracking) {
    if (!window.HoverWidget || !decision) return;
    if (decision.ab_group === 'control') return;
    const widget = Array.isArray(decision.widgets) && decision.widgets.length ? decision.widgets[0] : decision;
    window.HoverWidget.renderWidget(null, widget, {
      onAction(action, model) {
        tracking.track('widget_action', {
          action,
          widget_type: model.type,
          intervention_id: model.interventionId,
        }, { flush: true });
      },
    });
  }

  function maybeShowFallback(scenarioId, tracking) {
    if (!window.HoverWidget) return;
    const key = `hover_fallback_${scenarioId}_${location.pathname}`;
    if (sessionStorage.getItem(key) === 'true') return;
    sessionStorage.setItem(key, 'true');
    const widget = JSON.parse(JSON.stringify(FALLBACK_WIDGETS[scenarioId]));
    widget.data = Object.assign(widget.data, inferHotelContext());
    renderDecision({ ab_group: 'treatment', widgets: [widget] }, tracking);
  }

  function maybeShowMockDecision(tracking) {
    const scenarioId = mockDecisionScenario();
    if (!scenarioId) return;
    const key = `hover_mock_decision_${scenarioId}_${location.pathname}_${location.search}`;
    if (sessionStorage.getItem(key) === 'true') return;
    sessionStorage.setItem(key, 'true');
    const decision = createMockDecision(scenarioId);
    tracking.track('mock_decision_shown', {
      scenario_id: scenarioId,
      source: 'url_param',
    }, { flush: true });
    renderDecision(decision, tracking);
  }

  function wireDemoEvents(tracking) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-hover-event], [data-hover-copy]');
      if (!button) return;

      if (button.dataset.hoverEvent === 'add_to_cart') {
        tracking.track('cart_update', {
          action: 'add',
          product_id: button.dataset.hoverProductId || '',
          cart_count: Number(button.dataset.hoverCartCount || 1),
          context: inferHotelContext(),
        }, { flush: true });
        window.setTimeout(() => {
          tracking.requestDecision('S1', inferHotelContext()).then((decision) => {
            if (decision) renderDecision(decision, tracking);
          });
        }, 500);
      }

      if (button.dataset.hoverCopy) {
        const copyText = button.dataset.hoverCopy;
        tracking.track('clipboard_copy', {
          text: copyText,
          matches_hotel_or_room: true,
          context: inferHotelContext(),
        }, { flush: true });
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyText).catch(() => undefined);
        }
        tracking.requestDecision('S2', inferHotelContext()).then((decision) => {
          if (decision) renderDecision(decision, tracking);
          else maybeShowFallback('S2', tracking);
        });
      }
    });

    document.addEventListener('submit', (event) => {
      tracking.track('form_submit', {
        form_id: event.target.id || event.target.getAttribute('name') || 'anonymous_form',
        context: inferHotelContext(),
      }, { flush: true });
    }, true);

    document.addEventListener('change', (event) => {
      const field = event.target;
      if (!field || !/INPUT|TEXTAREA|SELECT/.test(field.tagName)) return;
      tracking.track('form_change', {
        field: field.name || field.id || field.type,
        value_present: Boolean(field.value),
      });
    }, true);
  }

  function start() {
    const base = sdkBasePath();
    Promise.all([
      loadScript(`${base}tracking-sdk/dist/hover-tracking-sdk.js`),
      loadScript(`${base}widget-sdk/dist/hover-widget-sdk.js`),
    ]).then(() => {
      const tracking = window.HoverTracking.init({
        apiUrl: CONFIG.ingestionApi,
        decisionUrl: CONFIG.decisionApi,
        appId: 'hoverstay-demo-site',
        debug: CONFIG.debug,
        onDecision(decision, client) {
          renderDecision(decision, client);
        },
      });
      wireDemoEvents(tracking);
      window.hover = tracking;
      maybeShowMockDecision(tracking);
    }).catch((error) => {
      if (CONFIG.debug) console.warn('[Hover] SDK load failed', error);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

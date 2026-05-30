(function () {
  const CONFIG = {
    ingestionApi: window.HOVER_INGESTION_API || 'http://localhost:4000/events',
    decisionApi: window.HOVER_DECISION_API || 'http://localhost:4001/decision',
    debug: window.HOVER_DEBUG === true,
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
    const priceText = document.body.textContent.match(/KRW\s?[\d,]+|[\d,]+\s?원/)?.[0] || '';
    const selectedCopy = document.querySelector('[data-hover-copy]')?.getAttribute('data-hover-copy') || '';
    return {
      hotel_name: title.replace(/\s+/g, ' ').slice(0, 80),
      room_name: selectedCopy || 'Selected room',
      price_text: priceText,
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

  function isLoggedIn() {
    try {
      return localStorage.getItem('hover_logged_in') === 'true';
    } catch (_) {
      return false;
    }
  }

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function redirectAuthenticatedAuthPage() {
    if (!isLoggedIn()) return;
    const page = currentPage();
    if (page === 'signin.html' || page === 'signup.html') {
      location.replace('index.html');
    }
  }

  function updateAuthButtons() {
    const loggedIn = isLoggedIn();
    const authItems = Array.from(document.querySelectorAll('a, button')).filter((element) => {
      const text = element.textContent.trim().toLowerCase();
      const href = element.getAttribute('href') || '';
      const onclick = element.getAttribute('onclick') || '';

      return (
        text === '로그인' ||
        text === 'login' ||
        text === '회원가입' ||
        text === 'register' ||
        href.includes('signin.html') ||
        href.includes('signup.html') ||
        onclick.includes('signin.html') ||
        onclick.includes('signup.html')
      );
    });

    if (!loggedIn) {
      document.querySelectorAll('[data-hover-logout]').forEach((element) => element.remove());
      authItems.forEach((element) => {
        element.style.display = '';
      });
      return;
    }

    const parent = authItems[0] && authItems[0].parentElement;
    authItems.forEach((element) => {
      element.style.display = 'none';
    });

    if (!parent || parent.querySelector('[data-hover-logout]')) return;

    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.dataset.hoverLogout = 'true';
    logoutButton.className = authItems[0] ? authItems[0].className : 'px-4 py-2 rounded-lg font-bold';
    logoutButton.textContent = '로그아웃';
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('hover_logged_in');
      localStorage.removeItem('hover_user');
      location.href = 'index.html';
    });

    parent.appendChild(logoutButton);
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
      redirectAuthenticatedAuthPage();
      updateAuthButtons();
      window.hover = tracking;
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

const INGESTION_API = 'http://localhost:4000/events';
const DECISION_API = 'http://localhost:4001/decision';

(function () {
  const SESSION_KEY = 'hover_session_id';

  function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `hover-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  const sessionId = getSessionId();

  function getDevice() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function sendEvent(type, payload) {
    try {
      const res = await fetch(INGESTION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          session_id: sessionId,
          device: getDevice(),
          events: [
            {
              event_id: uuid(),
              ts: Date.now(),
              type,
              payload: payload || {},
              page_url: location.href,
              referrer: document.referrer || '',
            },
          ],
        }),
      });
      if (res.ok) pollDecision();
    } catch (error) {
      console.warn('[Hover] event send failed', error);
    }
  }

  async function checkDecision() {
    try {
      const res = await fetch(`${DECISION_API}/${encodeURIComponent(sessionId)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
      });
      if (res.status === 204) return;
      if (!res.ok) return;

      const data = await res.json();

      if (data.component === 'coupon_modal') {
        showCouponModal(data);
      }

      if (data.component === 'price_match_banner') {
        showPriceMatchBanner(data);
      }
    } catch (error) {
      console.warn('[Hover] decision check failed', error);
    }
  }

  function pollDecision(attempts = 6, delayMs = 700) {
    let remaining = attempts;

    function tick() {
      if (remaining <= 0) return;
      remaining -= 1;
      checkDecision().then(() => {
        if (document.querySelector('[data-hover-widget]')) return;
        setTimeout(tick, delayMs);
      });
    }

    setTimeout(tick, delayMs);
  }

  function removeExistingWidget() {
    document.querySelectorAll('[data-hover-widget]').forEach((element) => element.remove());
  }

  function showCouponModal(data) {
    removeExistingWidget();

    const discount = data.context && data.context.discount_percent ? data.context.discount_percent : 10;
    const hotelName = data.context && data.context.hotel_name ? data.context.hotel_name : '선택하신 객실';

    const overlay = document.createElement('div');
    overlay.setAttribute('data-hover-widget', 'coupon_modal');
    overlay.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'background:rgba(15,23,42,0.46)',
      'font-family:Manrope, Noto Sans KR, sans-serif',
    ].join(';');

    overlay.innerHTML = `
      <div style="width:min(420px, calc(100vw - 32px)); background:#fff; border-radius:18px; box-shadow:0 24px 80px rgba(15,23,42,.28); overflow:hidden;">
        <div style="padding:28px 28px 22px; border-bottom:1px solid #eef2f7;">
          <div style="font-size:13px; font-weight:800; color:#b78b16; margin-bottom:8px;">${hotelName}</div>
          <h2 style="margin:0; font-size:26px; line-height:1.25; color:#10233f;">${data.copy.title}</h2>
          <p style="margin:12px 0 0; color:#526070; font-size:15px; line-height:1.6;">${data.copy.body}</p>
        </div>
        <div style="padding:22px 28px 26px;">
          <div style="display:flex; align-items:center; justify-content:space-between; padding:16px; border:1px dashed #d8aa32; border-radius:12px; background:#fff9e8; margin-bottom:18px;">
            <span style="font-weight:800; color:#10233f;">한정 쿠폰</span>
            <strong style="font-size:24px; color:#b7791f;">${discount}%</strong>
          </div>
          <button type="button" data-hover-coupon-cta style="width:100%; height:48px; border:0; border-radius:10px; background:#10233f; color:#fff; font-weight:800; cursor:pointer;">${data.copy.cta}</button>
          <button type="button" data-hover-close style="width:100%; height:40px; border:0; background:transparent; color:#6b7280; font-weight:700; cursor:pointer; margin-top:8px;">닫기</button>
        </div>
      </div>
    `;

    overlay.querySelector('[data-hover-close]').addEventListener('click', () => overlay.remove());
    overlay.querySelector('[data-hover-coupon-cta]').addEventListener('click', () => {
      sendEvent('click', { target: 'coupon_modal_cta', intervention_id: data.intervention_id });
      overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  function showPriceMatchBanner(data) {
    removeExistingWidget();

    const banner = document.createElement('div');
    banner.setAttribute('data-hover-widget', 'price_match_banner');
    banner.style.cssText = [
      'position:fixed',
      'top:16px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:9999',
      'width:min(760px, calc(100vw - 32px))',
      'background:#10233f',
      'color:#fff',
      'border-radius:14px',
      'box-shadow:0 18px 50px rgba(15,23,42,.28)',
      'font-family:Manrope, Noto Sans KR, sans-serif',
      'overflow:hidden',
    ].join(';');

    banner.innerHTML = `
      <div style="display:flex; gap:16px; align-items:center; padding:18px 20px;">
        <div style="flex:1; min-width:0;">
          <div style="font-size:17px; font-weight:900; margin-bottom:4px;">${data.copy.title}</div>
          <div style="font-size:14px; line-height:1.5; color:#dbe7f4;">${data.copy.body}</div>
        </div>
        <button type="button" data-hover-price-cta style="height:40px; padding:0 16px; border:0; border-radius:9px; background:#d8aa32; color:#10233f; font-weight:900; cursor:pointer; white-space:nowrap;">${data.copy.cta}</button>
        <button type="button" data-hover-close aria-label="닫기" style="width:34px; height:34px; border:0; border-radius:50%; background:rgba(255,255,255,.12); color:#fff; font-size:20px; cursor:pointer;">×</button>
      </div>
    `;

    banner.querySelector('[data-hover-close]').addEventListener('click', () => banner.remove());
    banner.querySelector('[data-hover-price-cta]').addEventListener('click', () => {
      sendEvent('click', { target: 'price_match_banner_cta', intervention_id: data.intervention_id });
      banner.remove();
    });

    document.body.appendChild(banner);
  }

  function bindMarkedElements() {
    document.querySelectorAll('[data-hover-event]').forEach((element) => {
      element.addEventListener('click', () => {
        const type = element.getAttribute('data-hover-event');
        const productId = element.getAttribute('data-hover-product-id') || 'hotel-room';
        const count = Number(element.getAttribute('data-hover-cart-count') || 1);

        if (type === 'add_to_cart') {
          sendEvent('add_to_cart', { product_id: productId });
          sendEvent('cart_change', { count });
          pollDecision();
          return;
        }

        sendEvent(type, { target: element.textContent.trim().slice(0, 80) });
      });
    });

    document.querySelectorAll('[data-hover-copy]').forEach((element) => {
      element.addEventListener('click', async () => {
        const text = element.getAttribute('data-hover-copy');
        try {
          await navigator.clipboard.writeText(text);
        } catch (_) {}
        sendEvent('clipboard_copy', { selected_text: text });
        sendEvent('broadcast_channel', { tab_count: 2 });
        pollDecision();
      });
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendEvent('visibility_change', { hidden: true });
      sendEvent('page_lifecycle', { phase: 'hide' });
      return;
    }

    sendEvent('visibility_change', { hidden: false });
    sendEvent('page_lifecycle', { phase: 'show' });
    pollDecision();
  });

  window.HoverClient = {
    sessionId,
    sendEvent,
    checkDecision,
    showCouponModal,
    showPriceMatchBanner,
  };

  sendEvent('page_view', {});
  pollDecision();
  bindMarkedElements();
})();

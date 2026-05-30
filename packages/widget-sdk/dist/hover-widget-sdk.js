(function (global) {
  const HOST_ID = 'hover-widget-host';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getWidget(decision) {
    if (!decision) return null;
    if (Array.isArray(decision.widgets) && decision.widgets.length) return decision.widgets[0];
    if (decision.component) {
      return {
        type: decision.component,
        data: Object.assign({}, decision.context || {}, decision.copy || {}),
        duration_ms: decision.duration_ms,
      };
    }
    return decision;
  }

  function normalize(widget) {
    const data = widget.data || widget.context || {};
    const type = widget.type === 'price_banner' ? 'price_match_banner' : widget.type;
    return {
      type,
      durationMs: widget.duration_ms || widget.durationMs || 0,
      hotelName: data.hotel_name || data.hotelName || 'HoverStay',
      roomName: data.room_name || data.roomName || '선택하신 객실',
      discountPercent: data.discount_percent || data.discountPercent || 5,
      priceDiff: data.price_diff || data.priceDiff || 12000,
      title: data.title || widget.title,
      body: data.body || widget.body,
      ctaText: data.cta_text || data.ctaText || data.cta || '확인하기',
      interventionId: widget.intervention_id || data.intervention_id || '',
    };
  }

  function styles() {
    return `
      :host { all: initial; font-family: Manrope, "Noto Sans KR", Arial, sans-serif; }
      button { font: inherit; }
      .scrim { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, .46); }
      .modal { width: min(420px, calc(100vw - 32px)); background: #fff; border-radius: 16px; box-shadow: 0 24px 80px rgba(15, 23, 42, .28); overflow: hidden; color: #10233f; }
      .modal-head { padding: 28px 28px 22px; border-bottom: 1px solid #eef2f7; }
      .eyebrow { font-size: 13px; font-weight: 800; color: #b7791f; margin-bottom: 8px; }
      .title { margin: 0; font-size: 24px; line-height: 1.25; font-weight: 900; letter-spacing: 0; }
      .body { margin: 12px 0 0; color: #526070; font-size: 15px; line-height: 1.6; }
      .modal-body { padding: 22px 28px 26px; }
      .coupon { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px dashed #d8aa32; border-radius: 12px; background: #fff9e8; margin-bottom: 18px; font-weight: 800; }
      .coupon strong { font-size: 24px; color: #b7791f; }
      .primary { width: 100%; height: 48px; border: 0; border-radius: 8px; background: #10233f; color: #fff; font-weight: 800; cursor: pointer; }
      .ghost { width: 100%; height: 40px; border: 0; background: transparent; color: #6b7280; font-weight: 700; cursor: pointer; margin-top: 8px; }
      .banner { position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 2147483000; width: min(760px, calc(100vw - 32px)); background: #10233f; color: #fff; border-radius: 12px; box-shadow: 0 18px 50px rgba(15, 23, 42, .28); overflow: hidden; }
      .banner-inner { display: flex; gap: 16px; align-items: center; padding: 18px 20px; }
      .banner-copy { flex: 1; min-width: 0; }
      .banner-title { font-size: 17px; font-weight: 900; margin-bottom: 4px; }
      .banner-body { font-size: 14px; line-height: 1.5; color: #dbe7f4; }
      .banner-cta { height: 40px; padding: 0 16px; border: 0; border-radius: 8px; background: #d8aa32; color: #10233f; font-weight: 900; cursor: pointer; white-space: nowrap; }
      .icon { width: 34px; height: 34px; border: 0; border-radius: 50%; background: rgba(255,255,255,.12); color: #fff; font-size: 20px; cursor: pointer; }
      @media (max-width: 560px) {
        .banner-inner { align-items: stretch; flex-direction: column; }
        .banner-cta { width: 100%; }
        .icon { position: absolute; top: 10px; right: 10px; }
      }
    `;
  }

  function ensureHost(container) {
    let host = container || global.document.getElementById(HOST_ID);
    if (!host) {
      host = global.document.createElement('div');
      host.id = HOST_ID;
      global.document.body.appendChild(host);
    }
    if (!host.shadowRoot) host.attachShadow({ mode: 'open' });
    return host;
  }

  function renderCoupon(model) {
    const title = model.title || `${model.hotelName} ${model.roomName} 할인 쿠폰`;
    const body = model.body || `지금 예약을 이어가면 ${model.discountPercent}% 쿠폰을 적용할 수 있습니다.`;
    return `
      <div class="scrim" data-hover-widget="coupon_modal">
        <section class="modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
          <div class="modal-head">
            <div class="eyebrow">${escapeHtml(model.hotelName)}</div>
            <h2 class="title">${escapeHtml(title)}</h2>
            <p class="body">${escapeHtml(body)}</p>
          </div>
          <div class="modal-body">
            <div class="coupon"><span>제한 쿠폰</span><strong>${escapeHtml(model.discountPercent)}%</strong></div>
            <button class="primary" type="button" data-hover-cta>${escapeHtml(model.ctaText)}</button>
            <button class="ghost" type="button" data-hover-close>닫기</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderBanner(model) {
    const title = model.title || `${model.hotelName}, 최저가 보장`;
    const body = model.body || `다른 사이트보다 약 ${Number(model.priceDiff).toLocaleString('ko-KR')}원 더 절약할 수 있습니다.`;
    return `
      <aside class="banner" data-hover-widget="price_match_banner">
        <div class="banner-inner">
          <div class="banner-copy">
            <div class="banner-title">${escapeHtml(title)}</div>
            <div class="banner-body">${escapeHtml(body)}</div>
          </div>
          <button class="banner-cta" type="button" data-hover-cta>${escapeHtml(model.ctaText)}</button>
          <button class="icon" type="button" data-hover-close aria-label="닫기">x</button>
        </div>
      </aside>
    `;
  }

  function renderWidget(container, widgetOrDecision, options) {
    const widget = getWidget(widgetOrDecision);
    if (!widget) return null;
    const model = normalize(widget);
    const host = ensureHost(container);
    const root = host.shadowRoot;
    root.innerHTML = `<style>${styles()}</style>${model.type === 'coupon_modal' ? renderCoupon(model) : renderBanner(model)}`;

    const track = options && typeof options.onAction === 'function' ? options.onAction : function () {};
    root.querySelector('[data-hover-close]').addEventListener('click', () => {
      track('dismiss', model);
      root.innerHTML = '';
    });
    root.querySelector('[data-hover-cta]').addEventListener('click', () => {
      track('click', model);
      root.innerHTML = '';
    });

    if (model.durationMs > 0) {
      global.setTimeout(() => {
        if (root.querySelector('[data-hover-widget]')) root.innerHTML = '';
      }, model.durationMs);
    }

    track('shown', model);
    return host;
  }

  function clear(container) {
    const host = container || global.document.getElementById(HOST_ID);
    if (host && host.shadowRoot) host.shadowRoot.innerHTML = '';
  }

  global.HoverWidget = { renderWidget, clear };
})(window);

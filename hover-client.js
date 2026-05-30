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
      await fetch(INGESTION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch (error) {
      console.warn('[Hover] event send failed', error);
    }
  }

  async function checkDecision() {
    try {
      const res = await fetch(`${DECISION_API}/${sessionId}`);
      if (res.status === 204) return;
      if (!res.ok) return;

      const data = await res.json();
      if (data.ab_group === 'control') return;

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

  function showSignupCouponBanner() {
    const isLoggedIn = localStorage.getItem('hover_logged_in') === 'true';
    const page = location.pathname.split('/').pop() || 'index.html';
    const allowedPage = page === 'index.html' || page === 'search.html';
    const dismissedOnHome = sessionStorage.getItem('hover_signup_coupon_dismissed_home') === 'true';

    if (isLoggedIn || !allowedPage || document.querySelector('[data-hover-signup-coupon]')) return;
    if (page === 'index.html' && dismissedOnHome) return;

    if (page === 'search.html') {
      const params = new URLSearchParams(location.search);
      const searchKey = params.toString() || location.href;
      const lastShownKey = sessionStorage.getItem('hover_signup_coupon_search_key');
      const shouldShow = lastShownKey !== searchKey && Math.random() < 0.45;
      if (!shouldShow) return;
      sessionStorage.setItem('hover_signup_coupon_search_key', searchKey);
    }

    const banner = document.createElement('div');
    banner.dataset.hoverSignupCoupon = 'true';
    banner.style.cssText = [
      'position:fixed',
      'top:76px',
      'left:50%',
      'transform:translateX(-50%)',
      'z-index:9998',
      'width:min(920px, calc(100vw - 32px))',
      'background:#ffffff',
      'border:1px solid #d6dde8',
      'border-radius:14px',
      'box-shadow:0 14px 40px rgba(15,23,42,.16)',
      'font-family:Manrope, Noto Sans KR, sans-serif',
      'overflow:hidden',
    ].join(';');

    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; padding:16px 18px;">
        <div style="width:42px; height:42px; border-radius:12px; background:#fff5db; color:#b7791f; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:900;">%</div>
        <div style="flex:1; min-width:0;">
          <div style="font-size:16px; font-weight:900; color:#00386b;">첫 가입 20% 추가 할인 쿠폰 제공</div>
          <div style="font-size:13px; color:#424750; margin-top:2px;">회원가입하고 HoverStay 데모 예약에서 즉시 사용할 수 있는 웰컴 쿠폰을 받아보세요.</div>
        </div>
        <button type="button" data-hover-signup-cta style="height:40px; padding:0 16px; border:0; border-radius:9px; background:#F5A623; color:#fff; font-weight:900; cursor:pointer; white-space:nowrap;">회원가입</button>
        <button type="button" data-hover-signup-close aria-label="닫기" style="width:34px; height:34px; border:0; border-radius:50%; background:#f3f3f9; color:#424750; font-size:20px; cursor:pointer;">×</button>
      </div>
    `;

    banner.querySelector('[data-hover-signup-cta]').addEventListener('click', () => {
      sendEvent('click', { target: 'signup_coupon_banner_cta' });
      location.href = 'signup.html';
    });

    banner.querySelector('[data-hover-signup-close]').addEventListener('click', () => {
      if (page === 'index.html') {
        sessionStorage.setItem('hover_signup_coupon_dismissed_home', 'true');
      }
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
        setTimeout(checkDecision, 800);
      });
    });
  }

  function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem('hover_logged_in') === 'true';
    if (!isLoggedIn) return;

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

  const roomCatalog = {
    mapo: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 451534, oldPrice: 523000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '조식 선택 가능', '도심 전망'] },
        { id: 'deluxe', name: '디럭스 시티뷰룸', price: 528000, oldPrice: 610000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '조식 포함', '고층 배정'] },
        { id: 'family', name: '패밀리 트윈룸', price: 612000, oldPrice: 690000, people: '성인 3명', bed: '더블베드 1개 + 싱글베드 1개', tags: ['무료 취소', '가족 추천', '넓은 객실'] },
      ],
    },
    guro: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 302720, oldPrice: 345000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '비즈니스 추천', '피트니스'] },
        { id: 'deluxe', name: '디럭스 더블룸', price: 356000, oldPrice: 398000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '조식 포함', '업무 데스크'] },
        { id: 'twin', name: '스탠다드 트윈룸', price: 372000, oldPrice: 420000, people: '성인 2명', bed: '싱글베드 2개', tags: ['무료 취소', '친구 여행', '금연 객실'] },
      ],
    },
    pine: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 92000, oldPrice: 142000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '해변 근처', '기본 객실'] },
        { id: 'ocean', name: '오션뷰 더블룸', price: 128000, oldPrice: 168000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '오션뷰', '조식 포함'] },
        { id: 'family', name: '패밀리 오션룸', price: 176000, oldPrice: 218000, people: '성인 4명', bed: '더블베드 2개', tags: ['무료 취소', '가족 추천', '넓은 객실'] },
      ],
    },
    lake: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 106000, oldPrice: 168000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '경포호 근처', '주차 가능'] },
        { id: 'lake', name: '레이크뷰 더블룸', price: 138000, oldPrice: 188000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '레이크뷰', '조식 포함'] },
        { id: 'suite', name: '레이크 스위트룸', price: 204000, oldPrice: 258000, people: '성인 3명', bed: '킹베드 1개', tags: ['무료 취소', '거실 공간', '프리미엄 뷰'] },
      ],
    },
    blue: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 128000, oldPrice: 168000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '해운대 도보 1분', '기본 객실'] },
        { id: 'ocean', name: '오션뷰 더블룸', price: 168000, oldPrice: 218000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '오션뷰', '조식 포함'] },
        { id: 'family', name: '패밀리 트윈룸', price: 224000, oldPrice: 278000, people: '성인 4명', bed: '더블베드 2개', tags: ['무료 취소', '가족 추천', '수영장 이용'] },
      ],
    },
    marine: {
      rooms: [
        { id: 'standard', name: '스탠다드 시티룸', price: 136000, oldPrice: 172000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '시티뷰', '루프탑 바'] },
        { id: 'bridge', name: '브릿지뷰 더블룸', price: 178000, oldPrice: 226000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '광안대교 전망', '조식 포함'] },
        { id: 'suite', name: '마린 스위트룸', price: 252000, oldPrice: 318000, people: '성인 3명', bed: '킹베드 1개', tags: ['무료 취소', '라운지 혜택', '넓은 객실'] },
      ],
    },
    ocean: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 162000, oldPrice: 210000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '제주 바다 근처', '기본 객실'] },
        { id: 'ocean', name: '오션뷰 스위트룸', price: 220000, oldPrice: 286000, people: '성인 2명', bed: '킹베드 1개', tags: ['무료 취소', '오션뷰', '조식 포함'] },
        { id: 'pool', name: '풀사이드 패밀리룸', price: 298000, oldPrice: 360000, people: '성인 4명', bed: '더블베드 2개', tags: ['무료 취소', '수영장 인접', '가족 추천'] },
      ],
    },
    seogwipo: {
      rooms: [
        { id: 'standard', name: '스탠다드 더블룸', price: 118000, oldPrice: 150000, people: '성인 2명', bed: '더블베드 1개', tags: ['무료 취소', '서귀포 중심', '기본 객실'] },
        { id: 'deluxe', name: '디럭스 더블룸', price: 148000, oldPrice: 188000, people: '성인 2명', bed: '퀸베드 1개', tags: ['무료 취소', '조식 포함', '고층 객실'] },
        { id: 'terrace', name: '테라스 패밀리룸', price: 214000, oldPrice: 268000, people: '성인 4명', bed: '더블베드 2개', tags: ['무료 취소', '테라스', '가족 추천'] },
      ],
    },
  };

  function money(value) {
    return `₩${Number(value).toLocaleString('ko-KR')}`;
  }

  function getCurrentHotelId() {
    const file = location.pathname.split('/').pop();
    if (file === 'mapo.html') return 'mapo';
    if (file === 'guro.html') return 'guro';
    if (file === 'pine_hotel.html') return 'pine';
    if (file === 'lake_hotel.html') return 'lake';
    if (file === 'blue_hotel.html') return 'blue';
    if (file === 'marine_hotel.html') return 'marine';
    if (file === 'ocean_hotel.html') return 'ocean';
    if (file === 'seogwipo_hotel.html') return 'seogwipo';
    return '';
  }

  function getSearchState() {
    const params = new URLSearchParams(location.search);
    const stored = JSON.parse(localStorage.getItem('hover_search_state') || '{}');
    const state = {
      checkin: params.get('checkin') || stored.checkin || '2026-06-01',
      checkout: params.get('checkout') || stored.checkout || '2026-06-03',
      adults: params.get('adults') || stored.adults || '2',
      rooms: params.get('rooms') || stored.rooms || '1',
    };
    localStorage.setItem('hover_search_state', JSON.stringify(state));
    return state;
  }

  function dateDiffNights(checkin, checkout) {
    const start = new Date(`${checkin}T00:00:00`);
    const end = new Date(`${checkout}T00:00:00`);
    const diff = Math.round((end - start) / 86400000);
    return diff > 0 ? diff : 1;
  }

  function formatShortDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  function hydrateDetailSearchInfo() {
    if (!getCurrentHotelId()) return;
    const state = getSearchState();
    const dateText = `${formatShortDate(state.checkin)} - ${formatShortDate(state.checkout)}`;
    const guestText = `성인 ${state.adults}명`;
    const roomGuestText = `성인 ${state.adults}명 · 객실 ${state.rooms}개`;

    document.querySelectorAll('span, p, div').forEach((element) => {
      if (element.children.length > 0) return;
      const text = element.textContent.trim();
      if (/\\d{1,2}월\\s*\\d{1,2}일/.test(text) && text.length <= 40) {
        element.textContent = dateText;
      }
      if (/성인\\s*\\d+명/.test(text) && text.length <= 30) {
        element.textContent = text.includes('객실') ? roomGuestText : guestText;
      }
    });
  }

  function buildBookingUrl(hotelId, roomId) {
    const state = getSearchState();
    const params = new URLSearchParams({ hotel: hotelId, room: roomId, ...state });
    return `booking.html?${params.toString()}`;
  }

  function updateMainHotelPrice(room) {
    document.querySelectorAll('[data-hover-main-price]').forEach((element) => {
      const suffix = element.dataset.hoverPriceSuffix || '';
      element.textContent = `${money(room.price)}${suffix}`;
    });
    document.querySelectorAll('[data-hover-old-price]').forEach((element) => {
      element.textContent = money(room.oldPrice);
    });
  }

  function markPriceElements() {
    document.querySelectorAll('.text-price-highlight, [class*="text-price-highlight"]').forEach((element) => {
      if (!element.textContent.includes('₩')) return;
      element.dataset.hoverMainPrice = 'true';
      if (element.textContent.includes('부터')) element.dataset.hoverPriceSuffix = '부터';
      else if (element.textContent.includes('/ 1박')) element.dataset.hoverPriceSuffix = ' / 1박';
    });
    document.querySelectorAll('.line-through').forEach((element) => {
      if (element.textContent.includes('₩')) element.dataset.hoverOldPrice = 'true';
    });
  }

  function updateBookingButtons(hotelId, roomId) {
    document.querySelectorAll('button[onclick*="booking.html"], a[href*="booking.html"]').forEach((element) => {
      const url = buildBookingUrl(hotelId, roomId);
      const isTopRoomButton = element.closest('nav') || element.textContent.includes('객실 상품 보기');

      if (isTopRoomButton) {
        element.textContent = '객실 선택하기';
        element.removeAttribute('onclick');
        element.removeAttribute('href');
        element.removeAttribute('data-hover-event');
        element.removeAttribute('data-hover-product-id');
        element.removeAttribute('data-hover-cart-count');
        if (!element.dataset.hoverRoomScroll) {
          element.dataset.hoverRoomScroll = 'true';
          element.addEventListener('click', () => {
            scrollToRoomOptions();
          });
        }
        return;
      }

      element.textContent = '예약하기';
      if (element.tagName === 'A') element.setAttribute('href', url);
      else element.setAttribute('onclick', `location.href='${url}'`);
    });
  }

  function scrollToReservationButton() {
    const target = Array.from(document.querySelectorAll('button, a')).find((element) => {
      const text = element.textContent.trim();
      const href = element.getAttribute('href') || '';
      const onclick = element.getAttribute('onclick') || '';
      return text === '예약하기' || href.includes('booking.html') || onclick.includes('booking.html');
    });

    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - Math.max(180, window.innerHeight * 0.28);
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function scrollToRoomOptions() {
    const target = document.querySelector('[data-hover-room-options]');
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - Math.max(180, window.innerHeight * 0.27);
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function renderRoomOptions() {
    const hotelId = getCurrentHotelId();
    const hotel = roomCatalog[hotelId];
    if (!hotel || document.querySelector('[data-hover-room-options]')) return;

    hydrateDetailSearchInfo();
    markPriceElements();
    const params = new URLSearchParams(location.search);
    const initialRoom = hotel.rooms.find((room) => room.id === params.get('room')) || hotel.rooms[0];
    updateMainHotelPrice(initialRoom);
    updateBookingButtons(hotelId, initialRoom.id);

    const section = document.createElement('section');
    section.dataset.hoverRoomOptions = 'true';
    section.className = 'max-w-[1280px] mx-auto px-4 my-8';
    section.innerHTML = `
      <div class="bg-white rounded-xl border border-outline-variant/60 shadow-[0_4px_18px_rgba(0,0,0,0.08)] overflow-hidden">
        <div class="p-6 border-b border-outline-variant/60 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 class="text-section-title font-bold text-on-surface">객실 선택</h2>
            <p class="text-helper-text text-on-surface-variant mt-1">원하는 객실을 선택하면 예약 요약 가격이 함께 변경됩니다.</p>
          </div>
          <span class="text-helper-text text-primary font-bold">검색 조건: 성인 ${getSearchState().adults}명 · 객실 ${getSearchState().rooms}개</span>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6">
          ${hotel.rooms.map((room) => `
            <article data-hover-room-card="${room.id}" class="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_28px_rgba(0,56,107,0.14)] cursor-pointer">
              <div>
                <h3 class="font-bold text-primary text-[18px]">${room.name}</h3>
                <p class="text-helper-text text-on-surface-variant mt-1">${room.people} · ${room.bed}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                ${room.tags.map((tag) => `<span class="text-[12px] font-bold bg-[#d4e3ff] text-primary px-2 py-1 rounded">${tag}</span>`).join('')}
              </div>
              <div class="mt-auto pt-4 border-t border-outline-variant/70">
                <p class="text-helper-text text-on-surface-variant line-through">${money(room.oldPrice)}</p>
                <p class="text-price-highlight font-bold text-primary">${money(room.price)} <span class="text-body-main font-normal text-on-surface-variant">/ 1박</span></p>
                <button type="button" data-hover-room-select="${room.id}" class="mt-4 w-full bg-[#F5A623] text-white font-bold py-3 rounded-lg hover:brightness-105 transition-all">이 객실 선택</button>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    const title = Array.from(document.querySelectorAll('h1')).find((element) => element.textContent.trim().length > 0);
    const titleCard = title && (
      title.closest('.bg-white') ||
      title.closest('.bg-surface-container-lowest') ||
      title.closest('section')
    );
    const main = document.querySelector('main');
    if (titleCard && titleCard.parentElement) {
      titleCard.insertAdjacentElement('afterend', section);
    } else if (main) {
      main.insertBefore(section, main.firstElementChild ? main.firstElementChild.nextSibling : null);
    } else {
      document.body.insertBefore(section, document.querySelector('footer'));
    }

    function selectRoom(roomId) {
      const room = hotel.rooms.find((item) => item.id === roomId) || hotel.rooms[0];
      updateMainHotelPrice(room);
      updateBookingButtons(hotelId, room.id);
      document.querySelectorAll('[data-hover-room-card]').forEach((card) => {
        const selected = card.dataset.hoverRoomCard === room.id;
        card.classList.toggle('border-primary', selected);
        card.classList.toggle('ring-2', selected);
        card.classList.toggle('ring-primary/15', selected);
      });
      localStorage.setItem('hover_selected_room', JSON.stringify({ hotelId, roomId: room.id, ...room }));
    }

    section.querySelectorAll('[data-hover-room-select]').forEach((button) => {
      button.addEventListener('click', () => {
        const roomId = button.dataset.hoverRoomSelect;
        selectRoom(roomId);
        scrollToReservationButton();
      });
    });

    section.querySelectorAll('[data-hover-room-card]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        const roomId = card.dataset.hoverRoomCard;
        selectRoom(roomId);
      });
    });

    selectRoom(initialRoom.id);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendEvent('visibility_change', { hidden: true });
      sendEvent('page_lifecycle', { phase: 'hide' });
      return;
    }

    sendEvent('visibility_change', { hidden: false });
    sendEvent('page_lifecycle', { phase: 'show' });
    setTimeout(checkDecision, 800);
  });

  window.HoverClient = {
    sessionId,
    sendEvent,
    checkDecision,
    showCouponModal,
    showPriceMatchBanner,
  };

  updateAuthButtons();
  showSignupCouponBanner();
  hydrateDetailSearchInfo();
  renderRoomOptions();
  sendEvent('page_view', {});
  bindMarkedElements();
})();

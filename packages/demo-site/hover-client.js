(function () {
  const params = new URLSearchParams(window.location.search);
  const CONFIG = {
    ingestionApi: window.HOVER_INGESTION_API || 'http://localhost:4000/events',
    decisionApi: window.HOVER_DECISION_API || 'http://localhost:4001/decision',
    debug: window.HOVER_DEBUG === true,
    mockDecision: params.get('mockDecision') === '1' || params.get('mockDecision') === 'true',
    mockVariant: params.get('mockWidget') || params.get('mockDecisionVariant') || 'coupon',
  };

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

  function money(value) {
    return `₩${Number(value).toLocaleString('ko-KR')}`;
  }

  function currentPage() {
    return location.pathname.split('/').pop() || 'index.html';
  }

  function getCurrentHotelId() {
    const file = currentPage();
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
    const query = new URLSearchParams(location.search);
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem('hover_search_state') || '{}');
    } catch (_) {
      stored = {};
    }
    const state = {
      checkin: query.get('checkin') || stored.checkin || '2026-06-01',
      checkout: query.get('checkout') || stored.checkout || '2026-06-03',
      adults: query.get('adults') || stored.adults || '2',
      rooms: query.get('rooms') || stored.rooms || '1',
    };
    localStorage.setItem('hover_search_state', JSON.stringify(state));
    return state;
  }

  function formatShortDate(value) {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }

  function inferHotelContext() {
    const title = document.querySelector('h1')?.textContent?.trim() || document.title || 'HoverStay';
    const priceText = document.body.textContent.match(/KRW\s?[\d,]+|₩\s?[\d,]+|[\d,]+\s?원/)?.[0] || '';
    const selectedRoom = getSelectedRoom();
    const selectedCopy = document.querySelector('[data-hover-copy]')?.getAttribute('data-hover-copy') || '';
    return {
      hotel_name: title.replace(/\s+/g, ' ').slice(0, 80),
      room_name: selectedRoom?.name || selectedCopy || 'Selected room',
      price_text: selectedRoom ? money(selectedRoom.price) : priceText,
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

  function createMockDecision() {
    const context = inferHotelContext();
    const isBanner = /banner|price/i.test(CONFIG.mockVariant);
    return {
      decision_id: `mock-${Date.now()}`,
      session_id: window.hover?.getSessionId?.() || 'mock-session',
      ab_group: 'treatment',
      widgets: [
        {
          type: isBanner ? 'price_match_banner' : 'coupon_modal',
          intervention_id: 'mock-decision-demo',
          duration_ms: 0,
          data: {
            hotel_name: context.hotel_name || 'HoverStay',
            room_name: context.room_name || '선택 객실',
            discount_percent: 15,
            price_diff: 24000,
            title: isBanner ? '지금 예약하면 최저가 혜택을 받을 수 있어요' : '시연용 쿠폰이 도착했습니다',
            body: isBanner
              ? 'mockDecision 모드에서 표시되는 배너입니다. 실제 decision API 응답 없이 UI 확인용으로만 표시됩니다.'
              : 'mockDecision 모드에서 표시되는 모달입니다. 일반 모드에서는 실제 백엔드 decision 응답이 있을 때만 표시됩니다.',
            cta_text: isBanner ? '혜택 확인' : '쿠폰 적용',
          },
        },
      ],
    };
  }

  function maybeRenderMockDecision(tracking) {
    if (!CONFIG.mockDecision) return;
    window.setTimeout(() => {
      renderDecision(createMockDecision(), tracking);
    }, 250);
  }

  function requestAndRenderDecision(tracking) {
    if (CONFIG.mockDecision) {
      renderDecision(createMockDecision(), tracking);
      return Promise.resolve();
    }
    return tracking.requestDecision().then((decision) => {
      if (decision) renderDecision(decision, tracking);
    });
  }

  function pollDecision(tracking, attempts, delayMs) {
    if (CONFIG.mockDecision) return;
    let remaining = attempts || 5;
    const delay = delayMs || 900;

    function tick() {
      if (remaining <= 0) return;
      remaining -= 1;
      tracking.requestDecision().then((decision) => {
        if (decision) {
          renderDecision(decision, tracking);
          return;
        }
        window.setTimeout(tick, delay);
      });
    }

    window.setTimeout(tick, delay);
  }

  function isLoggedIn() {
    try {
      return localStorage.getItem('hover_logged_in') === 'true';
    } catch (_) {
      return false;
    }
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

  function hydrateDetailSearchInfo() {
    if (!getCurrentHotelId()) return;
    const state = getSearchState();
    const dateText = `${formatShortDate(state.checkin)} - ${formatShortDate(state.checkout)}`;
    const guestText = `성인 ${state.adults}명`;
    const roomGuestText = `성인 ${state.adults}명 · 객실 ${state.rooms}개`;

    document.querySelectorAll('span, p, div').forEach((element) => {
      if (element.children.length > 0) return;
      const text = element.textContent.trim();
      if (/\d{1,2}월\s*\d{1,2}일/.test(text) && text.length <= 40) {
        element.textContent = dateText;
      }
      if (/성인\s*\d+명/.test(text) && text.length <= 30) {
        element.textContent = text.includes('객실') ? roomGuestText : guestText;
      }
    });
  }

  function getSelectedRoom() {
    try {
      const selected = JSON.parse(localStorage.getItem('hover_selected_room') || 'null');
      if (selected && selected.hotelId === getCurrentHotelId()) return selected;
    } catch (_) {}
    return null;
  }

  function buildBookingUrl(hotelId, roomId) {
    const state = getSearchState();
    const query = new URLSearchParams(Object.assign({ hotel: hotelId, room: roomId }, state));
    return `booking.html?${query.toString()}`;
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

  function scrollToRoomOptions() {
    const target = document.querySelector('[data-hover-room-options]');
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - Math.max(180, window.innerHeight * 0.27);
    window.scrollTo({ top, behavior: 'smooth' });
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
          element.addEventListener('click', scrollToRoomOptions);
        }
        return;
      }

      element.textContent = '예약하기';
      element.dataset.hoverEvent = 'add_to_cart';
      element.dataset.hoverProductId = `${hotelId}-${roomId}`;
      element.dataset.hoverCartCount = '1';
      if (element.tagName === 'A') element.setAttribute('href', url);
      else element.setAttribute('onclick', `location.href='${url}'`);
    });
  }

  function renderRoomOptions() {
    const hotelId = getCurrentHotelId();
    const hotel = roomCatalog[hotelId];
    if (!hotel || document.querySelector('[data-hover-room-options]')) return;

    hydrateDetailSearchInfo();
    markPriceElements();
    const query = new URLSearchParams(location.search);
    const initialRoom = hotel.rooms.find((room) => room.id === query.get('room')) || hotel.rooms[0];
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
      localStorage.setItem('hover_selected_room', JSON.stringify(Object.assign({ hotelId, roomId: room.id }, room)));
    }

    section.querySelectorAll('[data-hover-room-select]').forEach((button) => {
      button.addEventListener('click', () => {
        selectRoom(button.dataset.hoverRoomSelect);
        scrollToReservationButton();
      });
    });

    section.querySelectorAll('[data-hover-room-card]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('button')) return;
        selectRoom(card.dataset.hoverRoomCard);
      });
    });

    selectRoom(initialRoom.id);
  }

  function wireDemoEvents(tracking) {
    let cartPrimed = false;
    let s1HiddenSequenceSent = false;

    function emitCompareTabSignal(flush) {
      tracking.track('broadcast_channel', {
        message_type: 'demo_compare_tab',
        tab_count: 2,
        same_session: true,
      }, { flush: Boolean(flush), keepalive: Boolean(flush) });
    }

    function markCartIntent(source, productId) {
      cartPrimed = true;
      const context = inferHotelContext();
      tracking.track('cart_update', {
        action: 'add',
        product_id: productId || context.room_name || 'hotel-room',
        cart_count: 1,
        context,
        source,
      }, { flush: true, keepalive: true });
      tracking.track('cart_change', {
        count: 1,
        product_id: productId || context.room_name || 'hotel-room',
        context,
        source,
      }, { flush: true, keepalive: true });
    }

    function emitS1HiddenSequence() {
      if (!cartPrimed || s1HiddenSequenceSent) return;
      s1HiddenSequenceSent = true;
      const now = Date.now();

      tracking.track('page_lifecycle', {
        phase: 'show',
        hidden: false,
        __ts: now - 11500,
      });
      emitCompareTabSignal(false);
      tracking.track('page_lifecycle', {
        phase: 'hide',
        hidden: true,
        __ts: now - 11000,
      }, { flush: true, keepalive: true });
    }

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-hover-event], [data-hover-copy]');
      if (!button) return;

      if (button.dataset.hoverEvent === 'add_to_cart') {
        markCartIntent('cta', button.dataset.hoverProductId || '');
        window.setTimeout(() => requestAndRenderDecision(tracking), 500);
      }

      if (button.dataset.hoverCopy) {
        const copyText = button.dataset.hoverCopy;
        tracking.track('clipboard_copy', {
          text: copyText,
          matches_hotel_or_room: true,
          context: inferHotelContext(),
        }, { flush: true });
        emitCompareTabSignal(true);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(copyText).catch(() => undefined);
        }
        pollDecision(tracking, 6, 700);
      }
    });

    document.addEventListener('click', (event) => {
      const roomButton = event.target.closest('[data-hover-room-select]');
      if (!roomButton) return;
      markCartIntent('room_select', roomButton.dataset.hoverRoomSelect || '');
    }, true);

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-hover-room-select]')) return;
      const roomCard = event.target.closest('[data-hover-room-card]');
      if (!roomCard) return;
      markCartIntent('room_card', roomCard.dataset.hoverRoomCard || '');
    }, true);

    document.addEventListener('copy', () => {
      const selectedText = String(window.getSelection ? window.getSelection() : '').trim().slice(0, 160);
      if (!selectedText || !/(hotel|room|resort|suite|inn|호텔|객실|리조트|신라|롯데|숙소)/i.test(selectedText)) return;
      tracking.track('clipboard_copy', {
        selected_text: selectedText,
        matches_hotel_or_room: true,
        context: inferHotelContext(),
      }, { flush: true });
      emitCompareTabSignal(true);
      pollDecision(tracking, 6, 700);
    });

    document.addEventListener('visibilitychange', () => {
      const hidden = document.visibilityState === 'hidden';
      if (hidden) {
        emitS1HiddenSequence();
        tracking.track('page_lifecycle', { phase: 'hide', hidden: true }, { flush: true, keepalive: true });
        return;
      }

      tracking.track('page_lifecycle', { phase: 'show', hidden: false }, { flush: true });
      if (cartPrimed) pollDecision(tracking, 6, 800);
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
      const trackingOptions = {
        apiUrl: CONFIG.ingestionApi,
        decisionUrl: CONFIG.decisionApi,
        appId: 'hoverstay-demo-site',
        debug: CONFIG.debug,
        onDecision(decision, client) {
          renderDecision(decision, client);
        },
      };
      if (CONFIG.mockDecision) trackingOptions.decisionIntervalMs = 0;

      const tracking = window.HoverTracking.init(trackingOptions);
      wireDemoEvents(tracking);
      redirectAuthenticatedAuthPage();
      updateAuthButtons();
      renderRoomOptions();
      maybeRenderMockDecision(tracking);
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

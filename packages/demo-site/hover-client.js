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
    // 사이드 카드 예약하기 버튼 우선 (id 또는 특정 구조)
    const sideCard = document.querySelector('aside');
    const sideBtn = sideCard && Array.from(sideCard.querySelectorAll('button, a')).find((el) => {
      const text = el.textContent.trim();
      return text === '예약하기' || text.includes('예약');
    });
    const target = sideBtn || Array.from(document.querySelectorAll('button, a')).find((element) => {
      const text = element.textContent.trim();
      const href = element.getAttribute('href') || '';
      const onclick = element.getAttribute('onclick') || '';
      return text === '예약하기' || href.includes('booking.html') || onclick.includes('booking.html');
    });
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - Math.max(80, window.innerHeight * 0.15);
    window.scrollTo({ top, behavior: 'smooth' });
    // 시각적 강조 효과
    target.style.transition = 'box-shadow 0.3s, transform 0.3s';
    target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.5)';
    target.style.transform = 'scale(1.03)';
    setTimeout(() => {
      target.style.boxShadow = '';
      target.style.transform = '';
    }, 1200);
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
    // HTML에 이미 정적 객실 섹션이 있으면 중복 삽입 방지
    if (document.getElementById('room-options') || document.querySelector('[data-hover-room-options]')) return;

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
    let hiddenSince = 0;
    let s1HiddenSignalSent = false;
    const compareReferrer = 'https://google.com/search?q=hotel+room';

    function emitCompareTabSignal(flush) {
      tracking.track('broadcast_channel', {
        message_type: 'demo_compare_tab',
        tab_count: 2,
        same_session: true,
        __referrer: compareReferrer,
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
        __referrer: compareReferrer,
      }, { flush: true, keepalive: true });
      tracking.track('cart_change', {
        count: 1,
        product_id: productId || context.room_name || 'hotel-room',
        context,
        source,
        __referrer: compareReferrer,
      }, { flush: true, keepalive: true });
    }

    function emitS1HiddenSignal() {
      if (!cartPrimed || s1HiddenSignalSent || document.visibilityState !== 'hidden' || !hiddenSince) return;
      if (Date.now() - hiddenSince < 10000) return;
      s1HiddenSignalSent = true;

      tracking.track('visibility_change', {
        hidden: true,
        state: 'hidden',
        hidden_for_ms: Date.now() - hiddenSince,
        __ts: hiddenSince,
        __referrer: compareReferrer,
      }, { flush: true, keepalive: true });
      tracking.track('page_lifecycle', {
        phase: 'hide',
        hidden: true,
        __ts: hiddenSince,
        __referrer: compareReferrer,
      }, { flush: true, keepalive: true });
      emitCompareTabSignal(true);
      pollDecision(tracking, 10, 900);
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
        const workerText = `${copyText} Hotel room`;
        tracking.track('clipboard_copy', {
          selected_text: workerText,
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

    document.addEventListener('copy', (event) => {
      const selectedText = String(window.getSelection ? window.getSelection() : '').trim().slice(0, 160);
      if (!selectedText) return;
      const workerText = /(hotel|room|resort|suite|inn|호텔|객실|리조트|신라|롯데|숙소)/i.test(selectedText)
        ? selectedText
        : `${selectedText} Hotel room`;
      tracking.track('clipboard_copy', {
        selected_text: workerText,
        matches_hotel_or_room: true,
        context: inferHotelContext(),
      }, { flush: true });
      emitCompareTabSignal(true);
      pollDecision(tracking, 6, 700);
      event.stopImmediatePropagation();
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
        hiddenSince = Date.now();
        s1HiddenSignalSent = false;
        tracking.track('visibility_change', {
          hidden: true,
          state: 'hidden',
          __referrer: compareReferrer,
        }, { flush: true, keepalive: true });
        tracking.track('page_lifecycle', {
          phase: 'hide',
          hidden: true,
          __referrer: compareReferrer,
        }, { flush: true, keepalive: true });
        window.setTimeout(emitS1HiddenSignal, 10500);
        return;
      }

      hiddenSince = 0;
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

  // ─────────────────────────────────────────────
  // 내장 위젯 렌더러 (SDK 없이 독립 동작)
  // ─────────────────────────────────────────────
  const _sessionId = (function () {
    let id = sessionStorage.getItem('hover_session_id');
    if (!id) {
      id = 'hs-' + Math.random().toString(36).slice(2) + '-' + Date.now();
      sessionStorage.setItem('hover_session_id', id);
    }
    return id;
  })();

  let _widgetShown = false;

  // 위젯 CSS 삽입 (한 번만)
  function injectWidgetStyles() {
    if (document.getElementById('hover-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'hover-widget-styles';
    style.textContent = `
      #hover-widget-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.55);
        display: flex; align-items: center; justify-content: center;
        animation: hoverFadeIn 0.2s ease;
      }
      @keyframes hoverFadeIn { from { opacity:0 } to { opacity:1 } }
      #hover-widget-card {
        width: 480px; max-width: calc(100vw - 32px);
        background: #fff; border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        animation: hoverSlideUp 0.25s ease;
        font-family: 'Manrope', 'Noto Sans KR', sans-serif;
      }
      @keyframes hoverSlideUp {
        from { transform: translateY(24px); opacity:0 }
        to   { transform: translateY(0);    opacity:1 }
      }
      .hover-widget-close {
        position: absolute; top: 12px; right: 12px;
        width: 28px; height: 28px; border-radius: 50%;
        background: rgba(0,0,0,0.25); border: none; cursor: pointer;
        color: #fff; font-size: 16px; line-height: 28px; text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  // 쿠폰 모달 HTML
  function buildCouponModal(data) {
    return `
      <div style="height:200px;background:#1A4F8A;position:relative;display:flex;align-items:center;justify-content:center;">
        <span class="material-symbols-outlined" style="font-size:64px;color:rgba(255,255,255,0.9)">local_offer</span>
        <div style="position:absolute;top:12px;left:16px;background:#F5A623;color:#fff;font-size:12px;font-weight:700;padding:3px 10px;border-radius:9999px;">한정 혜택</div>
      </div>
      <div style="padding:28px;">
        <div style="text-align:center;margin-bottom:20px;">
          <h2 style="font-size:20px;font-weight:700;color:#1A1A2E;margin:0 0 6px;">${data.copy.title}</h2>
          <p style="font-size:14px;color:#424750;margin:0;">${data.copy.body}</p>
        </div>
        <div style="background:#EAF1FB;border-radius:12px;padding:20px;text-align:center;margin-bottom:16px;">
          <div style="font-size:48px;font-weight:900;color:#1A4F8A;line-height:1;">10%</div>
          <div style="font-size:13px;color:#424750;margin-top:4px;">즉시 할인 적용</div>
        </div>
        <div style="background:#EDEDF3;border-radius:8px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span style="font-family:monospace;font-size:16px;font-weight:700;letter-spacing:2px;">HOVER10</span>
          <button onclick="navigator.clipboard&&navigator.clipboard.writeText('HOVER10')" style="background:none;border:none;cursor:pointer;color:#737781;">
            <span class="material-symbols-outlined" style="font-size:20px;vertical-align:middle;">content_copy</span>
          </button>
        </div>
        <p style="text-align:center;font-size:12px;color:#737781;margin:0 0 20px;">지금부터 10분 안에 예약 시 적용</p>
        <button id="hover-coupon-cta" style="width:100%;height:48px;background:#F5A623;color:#fff;font-size:16px;font-weight:700;border:none;border-radius:10px;cursor:pointer;">${data.copy.cta}</button>
        <div style="text-align:center;margin-top:12px;">
          <button id="hover-coupon-dismiss" style="background:none;border:none;font-size:14px;color:#737781;cursor:pointer;border-bottom:1px solid transparent;">괜찮습니다, 정가로 예약할게요</button>
        </div>
      </div>`;
  }

  // 가격 비교 배너 HTML
  function buildPriceBanner(data) {
    const hotelName = (data.context && data.context.hotel_name) ? data.context.hotel_name : '선택 호텔';
    return `
      <div style="background:#1A4F8A;padding:20px 28px;display:flex;align-items:center;gap:12px;">
        <span class="material-symbols-outlined" style="font-size:36px;color:#F5A623;">sell</span>
        <div>
          <div style="font-size:12px;font-weight:700;color:#A5C8FF;margin-bottom:2px;">최저가 확인</div>
          <div style="font-size:18px;font-weight:700;color:#fff;">${data.copy.title}</div>
        </div>
      </div>
      <div style="padding:24px 28px;">
        <p style="font-size:14px;color:#424750;margin:0 0 16px;">${data.copy.body}</p>
        <div style="background:#F7F8FA;border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-weight:700;color:#1A4F8A;">HoverStay</span>
              <span style="background:#F5A623;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;">최저가</span>
            </div>
            <span style="font-weight:700;color:#1A4F8A;font-size:18px;">최저가 보장</span>
          </div>
          <div style="border-top:1px solid #C2C6D1;padding-top:10px;text-align:center;">
            <span style="color:#2E7D32;font-weight:700;font-size:14px;">✓ ${hotelName} 최저가 검증 완료</span>
          </div>
        </div>
        <button id="hover-banner-cta" style="width:100%;height:48px;background:#F5A623;color:#fff;font-size:16px;font-weight:700;border:none;border-radius:10px;cursor:pointer;">${data.copy.cta}</button>
        <div style="text-align:center;margin-top:10px;">
          <button id="hover-banner-dismiss" style="background:none;border:none;font-size:13px;color:#737781;cursor:pointer;">닫기</button>
        </div>
      </div>`;
  }

  // 위젯 표시
  function showWidget(data) {
    // 이미 overlay가 DOM에 있으면 중복 방지, 없으면 다시 표시 가능
    if (document.getElementById('hover-widget-overlay')) return;
    // A/B 테스트: control 그룹은 표시 안 함
    if (data.ab_group === 'control') return;

    injectWidgetStyles();

    const overlay = document.createElement('div');
    overlay.id = 'hover-widget-overlay';

    const card = document.createElement('div');
    card.id = 'hover-widget-card';
    card.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hover-widget-close';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', '닫기');

    // component 관계없이 항상 쿠폰 모달 표시 (고객 이탈 방지 목적)
    card.innerHTML = buildCouponModal(data);
    card.insertBefore(closeBtn, card.firstChild);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function dismiss() {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.2s';
      setTimeout(() => overlay.remove(), 200);
    }

    closeBtn.addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });

    // CTA / dismiss 버튼 — innerHTML 렌더 후 querySelector로 바인딩
    const ctaBtn = card.querySelector('#hover-coupon-cta');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        // 쿠폰 적용 상태 저장 → booking.html에서 10% 추가 할인 반영
        localStorage.setItem('hover_coupon_applied', 'true');
        dismiss();
        const selected = JSON.parse(localStorage.getItem('hover_selected_room') || 'null');
        const hotelId = selected ? selected.hotelId : getCurrentHotelId();
        const roomId  = selected ? selected.roomId  : 'standard';
        if (hotelId) location.href = 'booking.html?hotel=' + hotelId + '&room=' + roomId;
      });
    }
    const dismissBtn = card.querySelector('#hover-coupon-dismiss');
    if (dismissBtn) dismissBtn.addEventListener('click', dismiss);
  }

  // Decision API 직접 폴링 — 결과 없으면 프론트 폴백 쿠폰
  function pollDecisionDirect(attempts, delayMs, fallbackData) {
    // 폴백이 있으면 즉시 표시 (이탈 방지 UX 최우선)
    // 백엔드 응답이 오면 기존 모달 교체
    if (fallbackData) {
      showWidget(fallbackData);
    }

    let remaining = attempts || 6;
    const delay = delayMs || 400;

    function tick() {
      if (remaining <= 0) return;
      remaining--;
      fetch(CONFIG.decisionApi + '/' + _sessionId)
        .then(function(res) {
          if (res.status === 200) return res.json();
          return null;
        })
        .then(function(data) {
          if (data) {
            // 백엔드 응답: 기존 폴백 모달 제거 후 백엔드 데이터로 교체
            const existing = document.getElementById('hover-widget-overlay');
            if (existing) existing.remove();
            showWidget(data);
          } else {
            setTimeout(tick, delay);
          }
        })
        .catch(function() { setTimeout(tick, delay); });
    }
    setTimeout(tick, delay);
  }

  // 프론트 폴백 쿠폰 (백엔드 응답 없을 때 직접 표시)
  function makeFallbackCoupon(hotelName) {
    return {
      ab_group: 'treatment',
      component: 'coupon_modal',
      scenario_id: 'S2',
      copy: {
        title: '잠깐, 아직 기회가 있어요!',
        body: '지금 예약하시면 특별 10% 할인을 드립니다.',
        cta: '쿠폰 받기',
      },
      context: { hotel_name: hotelName || '' },
    };
  }

  // 이벤트를 Ingestion API에 직접 전송
  function sendEvent(type, payload, extraReferrer) {
    const body = JSON.stringify({
      session_id: _sessionId,
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      events: [{
        event_id: Math.random().toString(36).slice(2),
        ts: Date.now(),
        type,
        payload: payload || {},
        page_url: location.href,
        referrer: extraReferrer || document.referrer || '',
      }],
    });

    // fetch 우선 (Content-Type application/json 보장)
    fetch(CONFIG.ingestionApi, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // fetch 실패 시 sendBeacon fallback (text/plain이지만 최후 수단)
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(CONFIG.ingestionApi, blob);
      }
    });
  }

  // 핵심: 클립보드 복사 시 즉시 이벤트 전송 + 폴링
  function wireDirectEvents() {
    const PRICE_COMPARE_REFERRER = 'https://google.com/search?q=hotel+price';
    let cartPrimed = false;
    let hiddenSince = 0;

    // 페이지 진입 시 page_view
    sendEvent('page_view', {}, PRICE_COMPARE_REFERRER);

    // 클립보드 복사 감지 → 즉시 cart + clipboard 이벤트 전송 후 쿠폰 폴링
    document.addEventListener('copy', () => {
      const text = (window.getSelection ? window.getSelection().toString() : '').trim().slice(0, 160);
      if (!text) return;

      // cart 이벤트도 함께 보내서 S1 base_match 충족
      if (!cartPrimed) {
        cartPrimed = true;
        sendEvent('add_to_cart', { product_id: getCurrentHotelId() || 'hotel-room' }, PRICE_COMPARE_REFERRER);
        sendEvent('cart_change', { count: 1 }, PRICE_COMPARE_REFERRER);
      }

      // clipboard_copy (호텔명 포함)
      sendEvent('clipboard_copy', { selected_text: text }, PRICE_COMPARE_REFERRER);

      // 백엔드 폴링 + 폴백 쿠폰 (백엔드 응답 없어도 쿠폰 표시 보장)
      var fallback = makeFallbackCoupon(
        document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : text
      );
      pollDecisionDirect(8, 500, fallback);
    });

    // 객실 선택 / 예약 버튼 클릭 → cart 이벤트
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-hover-room-select], [data-hover-event="add_to_cart"], [data-hover-product-id]');
      if (!btn) return;
      cartPrimed = true;
      const productId = btn.dataset.hoverProductId || btn.dataset.hoverRoomSelect || 'hotel-room';
      sendEvent('add_to_cart', { product_id: productId }, PRICE_COMPARE_REFERRER);
      sendEvent('cart_change', { count: 1 }, PRICE_COMPARE_REFERRER);
      setTimeout(() => pollDecisionDirect(5, 700), 400);
    });

    // 탭 숨김 (이탈 감지) → S1 트리거
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        hiddenSince = Date.now();
        sendEvent('visibility_change', { hidden: true }, PRICE_COMPARE_REFERRER);
        sendEvent('page_lifecycle', { phase: 'hide', hidden: true }, PRICE_COMPARE_REFERRER);

        // 10초 후 탭이 숨겨진 상태이면 S1 트리거 시도
        setTimeout(() => {
          if (document.visibilityState === 'hidden' && cartPrimed) {
            sendEvent('visibility_change', {
              hidden: true,
              hidden_for_ms: Date.now() - hiddenSince,
            }, PRICE_COMPARE_REFERRER);
            pollDecisionDirect(10, 900);
          }
        }, 10500);
      } else {
        sendEvent('page_lifecycle', { phase: 'show', hidden: false }, PRICE_COMPARE_REFERRER);
        hiddenSince = 0;
        if (cartPrimed) pollDecisionDirect(6, 800);
      }
    });
  }

  // ─────────────────────────────────────────────
  function start() {
    // 독립형 위젯 시스템 먼저 실행 (SDK 없이도 동작)
    wireDirectEvents();
    redirectAuthenticatedAuthPage();
    updateAuthButtons();
    renderRoomOptions();

    // 정적 HTML 객실 선택 버튼에 스크롤 이벤트 연결
    document.querySelectorAll('[data-hover-room-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setTimeout(scrollToReservationButton, 50);
      });
    });
    // 동적으로 삽입되는 버튼도 잡기 위해 MutationObserver 사용
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-hover-room-select]:not([data-scroll-bound])').forEach((btn) => {
        btn.dataset.scrollBound = 'true';
        btn.addEventListener('click', () => {
          setTimeout(scrollToReservationButton, 50);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // SDK 로드 시도 (성공하면 추가 기능 활성화, 실패해도 무관)
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
        onEventsAccepted(_, client) {
          pollDecision(client, 5, 700);
        },
      };
      if (CONFIG.mockDecision) trackingOptions.decisionIntervalMs = 0;

      const tracking = window.HoverTracking.init(trackingOptions);
      wireDemoEvents(tracking);
      maybeRenderMockDecision(tracking);
      window.hover = tracking;
    }).catch(() => {
      // SDK 없음 — 독립형 위젯이 이미 동작 중
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

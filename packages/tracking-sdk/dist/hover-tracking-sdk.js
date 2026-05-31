(function (global) {
  const DEFAULTS = {
    apiUrl: 'http://localhost:4000/events',
    decisionUrl: 'http://localhost:4001/decision',
    appId: 'hover-demo-site',
    batchSize: 10,
    flushIntervalMs: 2000,
    idleAfterMs: 30000,
    decisionIntervalMs: 5000,
    debug: false,
  };

  const SESSION_KEY = 'hover_session_id';
  const USER_KEY = 'hover_user_id';
  const CHANNEL_NAME = 'hover-tab-presence';
  const trackedFields = new WeakMap();

  const EVENT_TYPE_MAP = {
    focus_change: 'window_focus',
    idle_return: 'idle',
    form_focus: 'form_field',
    form_dwell: 'form_field',
    form_change: 'form_field',
    form_submit: 'form_field',
    cart_update: 'cart_change',
    widget_action: 'click',
    page_unload: 'page_lifecycle',
  };

  function safeStorageGet(key) {
    try {
      return global.localStorage && global.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (global.localStorage) global.localStorage.setItem(key, value);
    } catch (_) {}
  }

  function id(prefix) {
    if (global.crypto && typeof global.crypto.randomUUID === 'function') {
      return global.crypto.randomUUID();
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getOrCreateSessionId() {
    const existing = safeStorageGet(SESSION_KEY);
    if (existing) return existing;
    const created = `hover-${id('session')}`;
    safeStorageSet(SESSION_KEY, created);
    return created;
  }

  function getUserId() {
    const stored = safeStorageGet(USER_KEY);
    if (stored) return stored;
    const created = `anon-${id('user').slice(0, 12)}`;
    safeStorageSet(USER_KEY, created);
    return created;
  }

  function getDevice() {
    const width = global.innerWidth || 0;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function backendEventType(type, payload) {
    if (type === 'cart_update' && payload && payload.action === 'add') return 'add_to_cart';
    return EVENT_TYPE_MAP[type] || type;
  }

  function backendPayload(type, payload) {
    const source = payload || {};
    if (type === 'visibility_change') {
      return {
        hidden: source.hidden === true || source.state === 'hidden',
        state: source.state,
        hidden_for_ms: source.hidden_for_ms,
      };
    }
    if (type === 'focus_change') {
      return { focused: Boolean(source.focused) };
    }
    if (type === 'idle_return') {
      return { idle_for_ms: source.idle_for_ms, source: source.source };
    }
    if (type === 'clipboard_copy') {
      return {
        selected_text: source.selected_text || source.text || '',
        matches_hotel_or_room: Boolean(source.matches_hotel_or_room),
      };
    }
    if (type === 'cart_update') {
      return {
        count: Number(source.cart_count || source.count || 0),
        action: source.action,
        product_id: source.product_id,
        context: source.context || {},
      };
    }
    if (type === 'page_unload') {
      return { phase: 'hide' };
    }
    if (type === 'page_lifecycle') {
      return {
        phase: source.phase,
        hidden: source.hidden === true || source.phase === 'hide',
      };
    }
    if (type === 'form_focus' || type === 'form_dwell' || type === 'form_change' || type === 'form_submit') {
      return Object.assign({ field_event: type }, source);
    }
    const clean = Object.assign({}, source);
    delete clean.__ts;
    delete clean.__referrer;
    delete clean.__page_url;
    return clean;
  }

  function normalizeEvent(sessionId, type, payload) {
    const source = payload || {};
    const ts = Number(source.__ts);
    return {
      event_id: id('event'),
      ts: Number.isFinite(ts) ? ts : Date.now(),
      type: backendEventType(type, payload),
      payload: backendPayload(type, payload),
      page_url: source.__page_url || (global.location ? global.location.href : ''),
      referrer: source.__referrer || (global.document ? global.document.referrer || '' : ''),
    };
  }

  function postJson(url, body, useKeepalive) {
    const json = JSON.stringify(body);
    if (typeof global.fetch !== 'function') return Promise.resolve();
    return global.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: Boolean(useKeepalive),
      credentials: 'omit',
    });
  }

  function decisionEndpoint(baseUrl, sessionId) {
    let clean = String(baseUrl || DEFAULTS.decisionUrl).replace(/\/$/, '').replace(/\/decide$/, '/decision');
    if (/\/decision\/[^/]+$/.test(clean)) return clean;
    if (!/\/decision$/.test(clean)) clean = `${clean}/decision`;
    return `${clean}/${encodeURIComponent(sessionId)}`;
  }

  function createClient(options) {
    const config = Object.assign({}, DEFAULTS, options || {});
    const sessionId = config.sessionId && config.sessionId !== 'auto' ? config.sessionId : getOrCreateSessionId();
    const userId = config.userId || getUserId();
    const queue = [];
    const listeners = [];
    const api = {};
    let flushTimer = null;
    let decisionTimer = null;
    let lastActivity = Date.now();
    let lastScrollBucket = -1;
    let hiddenAt = null;
    let channel = null;
    let tabCount = 1;

    function log() {
      if (config.debug && global.console) console.debug.apply(console, ['[HoverTracking]'].concat(Array.from(arguments)));
    }

    function enqueue(type, payload, opts) {
      const event = normalizeEvent(sessionId, type, payload);
      queue.push(event);
      if (queue.length >= config.batchSize || (opts && opts.flush)) {
        api.flush(Boolean(opts && opts.keepalive));
      }
      return event;
    }

    api.track = enqueue;
    api.getSessionId = () => sessionId;
    api.getUserId = () => userId;
    api.getConfig = () => Object.assign({}, config);

    api.flush = function flush(useKeepalive) {
      if (!queue.length) return Promise.resolve();
      const events = queue.splice(0, queue.length);
      const payload = {
        session_id: sessionId,
        user_id: userId,
        device: getDevice(),
        events,
      };
      return postJson(config.apiUrl, payload, useKeepalive).then((response) => {
        if (response && !response.ok) throw new Error(`events request failed: ${response.status}`);
        if (typeof config.onEventsAccepted === 'function') {
          config.onEventsAccepted({ events, response, payload }, api);
        }
      }).catch((error) => {
        log('flush failed', error);
        queue.unshift.apply(queue, events.slice(-config.batchSize));
      });
    };

    api.requestDecision = function requestDecision() {
      if (typeof global.fetch !== 'function') return Promise.resolve(null);
      return global.fetch(decisionEndpoint(config.decisionUrl, sessionId), {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'omit',
      })
        .then((response) => {
          if (!response || response.status === 204 || !response.ok) return null;
          return response.json();
        })
        .catch((error) => {
          log('decision failed', error);
          return null;
        });
    };

    function on(target, eventName, handler, options) {
      if (!target || !target.addEventListener) return;
      target.addEventListener(eventName, handler, options);
      listeners.push(() => target.removeEventListener(eventName, handler, options));
    }

    function markActivity(source) {
      const now = Date.now();
      const idleForMs = now - lastActivity;
      lastActivity = now;
      if (idleForMs >= config.idleAfterMs) {
        enqueue('idle_return', { idle_for_ms: idleForMs, source });
      }
    }

    function setupCoreSignals() {
      enqueue('page_view', { title: global.document ? global.document.title : '' });

      on(global.document, 'visibilitychange', () => {
        const state = global.document.visibilityState;
        const payload = { state, hidden: state === 'hidden' };
        if (state === 'hidden') {
          hiddenAt = Date.now();
        } else if (hiddenAt) {
          payload.hidden_for_ms = Date.now() - hiddenAt;
          hiddenAt = null;
        }
        enqueue('visibility_change', payload, { flush: state === 'hidden', keepalive: state === 'hidden' });
      });

      on(global, 'focus', () => enqueue('focus_change', { focused: true }));
      on(global, 'blur', () => enqueue('focus_change', { focused: false }, { flush: true }));

      ['keydown', 'click', 'touchstart', 'scroll'].forEach((eventName) => {
        on(global, eventName, () => markActivity(eventName), { passive: true });
      });

      on(global, 'scroll', () => {
        const doc = global.document.documentElement;
        const max = Math.max(1, doc.scrollHeight - global.innerHeight);
        const pct = Math.min(100, Math.round((global.scrollY / max) * 100));
        const bucket = Math.floor(pct / 25) * 25;
        if (bucket !== lastScrollBucket) {
          lastScrollBucket = bucket;
          enqueue('scroll_depth', { percent: pct, bucket });
        }
      }, { passive: true });

      on(global.document, 'copy', () => {
        const text = String(global.getSelection ? global.getSelection() : '').slice(0, 160);
        enqueue('clipboard_copy', {
          selected_text: text,
          matches_hotel_or_room: /hotel|room|stay|resort|suite|inn|호텔|객실|리조트|숙소/i.test(text),
        }, { flush: true });
      });

      on(global.document, 'focusin', (event) => {
        const target = event.target;
        if (!target || !/INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
        trackedFields.set(target, Date.now());
        enqueue('form_focus', { name: target.name || target.id || target.type || target.tagName });
      });

      on(global.document, 'focusout', (event) => {
        const target = event.target;
        if (!target || !trackedFields.has(target)) return;
        enqueue('form_dwell', {
          name: target.name || target.id || target.type || target.tagName,
          dwell_ms: Date.now() - trackedFields.get(target),
        });
        trackedFields.delete(target);
      });

      on(global, 'pagehide', () => {
        enqueue('page_unload', {}, { flush: true, keepalive: true });
        api.flush(true);
      });
    }

    function setupBroadcastChannel() {
      if (typeof global.BroadcastChannel !== 'function') return;
      channel = new BroadcastChannel(CHANNEL_NAME);
      const tabId = id('tab');
      on(channel, 'message', (event) => {
        if (!event.data || event.data.tabId === tabId) return;
        if (event.data.type === 'hello') {
          tabCount += 1;
          channel.postMessage({ type: 'ack', tabId, sessionId });
        }
        if (event.data.type === 'ack') tabCount += 1;
        enqueue('broadcast_channel', {
          message_type: event.data.type,
          tab_count: tabCount,
          same_session: event.data.sessionId === sessionId,
        });
      });
      channel.postMessage({ type: 'hello', tabId, sessionId });
    }

    api.start = function start() {
      setupCoreSignals();
      setupBroadcastChannel();
      flushTimer = global.setInterval(() => api.flush(false), config.flushIntervalMs);
      if (config.onDecision && config.decisionIntervalMs > 0) {
        decisionTimer = global.setInterval(() => {
          api.requestDecision().then((decision) => {
            if (decision) config.onDecision(decision, api);
          });
        }, config.decisionIntervalMs);
      }
      return api;
    };

    api.destroy = function destroy() {
      listeners.splice(0).forEach((off) => off());
      if (flushTimer) global.clearInterval(flushTimer);
      if (decisionTimer) global.clearInterval(decisionTimer);
      if (channel) channel.close();
      api.flush(true);
    };

    return api;
  }

  global.HoverTracking = {
    init(options) {
      const client = createClient(options || {});
      global.hoverTracking = client;
      return client.start();
    },
    createClient,
  };
})(window);

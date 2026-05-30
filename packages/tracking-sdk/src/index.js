(function (global) {
  const DEFAULTS = {
    apiUrl: 'http://localhost:4000/events',
    decisionUrl: 'http://localhost:4001/decide',
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

  function normalizeEvent(sessionId, userId, appId, type, payload) {
    return {
      event_id: id('event'),
      session_id: sessionId,
      user_id: userId,
      app_id: appId,
      ts: new Date().toISOString(),
      event_type: type,
      type,
      page_url: global.location ? global.location.href : '',
      referrer: global.document ? global.document.referrer || '' : '',
      device: getDevice(),
      payload: payload || {},
    };
  }

  function postJson(url, body, useBeacon) {
    const json = JSON.stringify(body);
    if (useBeacon && global.navigator && typeof global.navigator.sendBeacon === 'function') {
      const blob = new Blob([json], { type: 'application/json' });
      if (global.navigator.sendBeacon(url, blob)) return Promise.resolve();
    }
    if (typeof global.fetch !== 'function') return Promise.resolve();
    return global.fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: useBeacon,
    }).then(() => undefined);
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
      const event = normalizeEvent(sessionId, userId, config.appId, type, payload);
      queue.push(event);
      if (queue.length >= config.batchSize || (opts && opts.flush)) {
        api.flush(Boolean(opts && opts.beacon));
      }
      return event;
    }

    api.track = enqueue;
    api.getSessionId = () => sessionId;
    api.getUserId = () => userId;
    api.getConfig = () => Object.assign({}, config);

    api.flush = function flush(useBeacon) {
      if (!queue.length) return Promise.resolve();
      const events = queue.splice(0, queue.length);
      const payload = {
        session_id: sessionId,
        user_id: userId,
        app_id: config.appId,
        device: getDevice(),
        events,
      };
      return postJson(config.apiUrl, payload, useBeacon).catch((error) => {
        log('flush failed', error);
        queue.unshift.apply(queue, events.slice(-config.batchSize));
      });
    };

    api.requestDecision = function requestDecision(scenarioId, context) {
      const body = {
        session_id: sessionId,
        user_id: userId,
        scenario_id: scenarioId || 'auto',
        context: context || {},
      };
      if (typeof global.fetch !== 'function') return Promise.resolve(null);
      return global.fetch(config.decisionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
        const payload = { state };
        if (state === 'hidden') {
          hiddenAt = Date.now();
        } else if (hiddenAt) {
          payload.hidden_for_ms = Date.now() - hiddenAt;
          hiddenAt = null;
        }
        enqueue('visibility_change', payload, { flush: state === 'hidden', beacon: state === 'hidden' });
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
          text,
          matches_hotel_or_room: /호텔|스테이|리조트|객실|룸|hotel|room|stay/i.test(text),
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
        enqueue('page_unload', {}, { flush: true, beacon: true });
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
          api.requestDecision('auto').then((decision) => {
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

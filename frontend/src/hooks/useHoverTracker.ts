import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { DecisionResponse, TrackingEvent } from '../types';

const SESSION_KEY = 'hoverstay_session_id';

function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `hover-${Date.now()}-${Math.random().toString(16).substring(2, 8)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useHoverTracker() {
  const location = useLocation();
  const sessionIdRef = useRef<string>(getOrCreateSessionId());
  const eventQueueRef = useRef<TrackingEvent[]>([]);
  const hasTriggeredExitIntent = useRef<boolean>(false);
  const hasTriggeredCopyIntent = useRef<boolean>(false);

  const [activeWidget, setActiveWidget] = useState<DecisionResponse | null>(null);
  const [triggerDevice, setTriggerDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Helper to detect mobile device
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }, []);

  // Helper to append and flush events
  const trackEvent = useCallback((type: string, payload: Record<string, unknown> = {}) => {
    const event: TrackingEvent = {
      event_id: `evt-${Date.now()}-${Math.random().toString(16).substring(2, 6)}`,
      ts: Date.now(),
      type,
      payload,
      page_url: window.location.href,
      referrer: document.referrer || '',
    };

    eventQueueRef.current.push(event);

    // Flush batch to API
    if (eventQueueRef.current.length >= 1) {
      const batch = [...eventQueueRef.current];
      eventQueueRef.current = [];
      api.sendIngestionEvents(batch);
    }
  }, []);

  // Check decision engine for dynamic interventions
  const checkDecision = useCallback(async (triggerReason?: string, deviceType: 'desktop' | 'mobile' = 'desktop') => {
    try {
      setTriggerDevice(deviceType);
      const decision = await api.checkDecision(sessionIdRef.current, triggerReason);
      if (decision.component) {
        setActiveWidget(decision);
      }
    } catch (err) {
      console.warn('[useHoverTracker] Decision check failed:', err);
    }
  }, []);

  // 1. Auto track page views on route change & setup mobile history interceptor
  useEffect(() => {
    // Reset trigger flag on route change to allow testing on new pages
    hasTriggeredExitIntent.current = false;

    trackEvent('page_view', {
      pathname: location.pathname,
      search: location.search,
      title: document.title,
      device: isMobileDevice() ? 'mobile' : 'desktop',
    });

    // Mobile Push State Interceptor for Back Button Exit-Intent
    if (isMobileDevice()) {
      window.history.pushState({ hoverstay_intercepted: true }, '', window.location.href);
    }
  }, [location, trackEvent, isMobileDevice]);

  // 2. PC Mouse Exit-Intent Detection (mousemove or mouseleave at clientY <= 15px)
  useEffect(() => {
    const handleMousePosition = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggeredExitIntent.current) {
        hasTriggeredExitIntent.current = true;
        trackEvent('exit_intent_detected', { clientY: e.clientY, device: 'desktop' });
        checkDecision('exit_intent', 'desktop');
      }
    };

    document.addEventListener('mousemove', handleMousePosition);
    document.addEventListener('mouseleave', handleMousePosition);
    return () => {
      document.removeEventListener('mousemove', handleMousePosition);
      document.removeEventListener('mouseleave', handleMousePosition);
    };
  }, [trackEvent, checkDecision]);

  // 3. Mobile Back Button Intercept (`popstate` event)
  useEffect(() => {
    const handlePopState = () => {
      if (!hasTriggeredExitIntent.current) {
        hasTriggeredExitIntent.current = true;
        trackEvent('exit_intent_detected', { trigger: 'mobile_back_button', device: 'mobile' });
        checkDecision('exit_intent', 'mobile');

        // Push state again so next back press will actually navigate
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [trackEvent, checkDecision]);

  // 4. Mobile Fast Scroll Up (Flinging towards address bar)
  useEffect(() => {
    let startY = 0;
    let startTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();

        const deltaY = endY - startY;
        const duration = endTime - startTime;

        if (
          deltaY < -150 &&
          duration < 200 &&
          window.scrollY < 100 &&
          !hasTriggeredExitIntent.current
        ) {
          hasTriggeredExitIntent.current = true;
          trackEvent('exit_intent_detected', {
            trigger: 'mobile_fast_scroll_up',
            deltaY,
            duration,
            device: 'mobile',
          });
          checkDecision('exit_intent', 'mobile');
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [trackEvent, checkDecision]);

  // 5. Hotel Name / Text Copy Detection (Detect price comparison searching)
  useEffect(() => {
    const handleCopy = () => {
      const selectedText = window.getSelection()?.toString().trim() || '';
      if (selectedText.length >= 2 && !hasTriggeredCopyIntent.current) {
        hasTriggeredCopyIntent.current = true;
        trackEvent('clipboard_copy', { copied_text: selectedText.substring(0, 100) });
        checkDecision('copy_intent', isMobileDevice() ? 'mobile' : 'desktop');
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, [trackEvent, checkDecision, isMobileDevice]);

  // 6. Tab Switch / Visibility Change Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('visibility_change', { state: 'hidden' });
        document.title = '🎁 [최저가 보장] 선택하신 객실 혜택 유효 중!';
      } else {
        trackEvent('visibility_change', { state: 'visible' });
        document.title = 'HoverStay - 국내 단독 최저가 프리미엄 스테이';
        checkDecision('tab_return', isMobileDevice() ? 'mobile' : 'desktop');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent, checkDecision, isMobileDevice]);

  // Close active widget modal/banner
  const dismissWidget = useCallback(() => {
    if (activeWidget) {
      trackEvent('widget_dismissed', { component: activeWidget.component });
    }
    setActiveWidget(null);
    // Allow re-testing on subsequent mouse moves
    setTimeout(() => {
      hasTriggeredExitIntent.current = false;
    }, 1000);
  }, [activeWidget, trackEvent]);

  // Accept/click widget offer
  const acceptWidget = useCallback(() => {
    if (activeWidget) {
      trackEvent('widget_accepted', { component: activeWidget.component, context: activeWidget.context });
    }
    setActiveWidget(null);
  }, [activeWidget, trackEvent]);

  return {
    sessionId: sessionIdRef.current,
    trackEvent,
    activeWidget,
    triggerDevice,
    dismissWidget,
    acceptWidget,
    triggerExitIntentManual: () => checkDecision('exit_intent', isMobileDevice() ? 'mobile' : 'desktop'),
  };
}

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
  const checkDecision = useCallback(async (triggerReason?: string) => {
    try {
      const decision = await api.checkDecision(sessionIdRef.current, triggerReason);
      if (decision.component) {
        setActiveWidget(decision);
      }
    } catch (err) {
      console.warn('[useHoverTracker] Decision check failed:', err);
    }
  }, []);

  // 1. Auto track page views on route change
  useEffect(() => {
    trackEvent('page_view', {
      pathname: location.pathname,
      search: location.search,
      title: document.title,
    });
  }, [location, trackEvent]);

  // 2. Mouse Exit-Intent Detection (clientY <= 15px)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggeredExitIntent.current) {
        hasTriggeredExitIntent.current = true;
        trackEvent('exit_intent_detected', { clientY: e.clientY });
        checkDecision('exit_intent');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [trackEvent, checkDecision]);

  // 3. Hotel Name / Text Copy Detection (Detect price comparison searching on Agoda/Naver)
  useEffect(() => {
    const handleCopy = () => {
      const selectedText = window.getSelection()?.toString().trim() || '';
      if (selectedText.length >= 2 && !hasTriggeredCopyIntent.current) {
        hasTriggeredCopyIntent.current = true;
        trackEvent('clipboard_copy', { copied_text: selectedText.substring(0, 100) });
        checkDecision('copy_intent');
      }
    };

    document.addEventListener('copy', handleCopy);
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, [trackEvent, checkDecision]);

  // 4. Tab Switch / Visibility Change Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackEvent('visibility_change', { state: 'hidden' });
        document.title = '🎁 [최저가 보장] 선택하신 객실 혜택 유효 중!';
      } else {
        trackEvent('visibility_change', { state: 'visible' });
        document.title = 'HoverStay - 프리미엄 스테이 예약';
        checkDecision('tab_return');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [trackEvent, checkDecision]);

  // Close active widget modal/banner
  const dismissWidget = useCallback(() => {
    if (activeWidget) {
      trackEvent('widget_dismissed', { component: activeWidget.component });
    }
    setActiveWidget(null);
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
    dismissWidget,
    acceptWidget,
    triggerExitIntentManual: () => checkDecision('exit_intent')
  };
}

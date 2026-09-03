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

  // 2. Mouse Exit-Intent Detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse moves near or above top boundary (clientY <= 10)
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

export type AnalyticsEventName =
  | "quiz_start"
  | "question_answered"
  | "question_exit"
  | "quiz_complete"
  | "share_click"
  | "feedback_submit"
  | "ko_fi_click";

export interface AnalyticsEvent<T extends AnalyticsEventName = AnalyticsEventName> {
  name: T;
  payload?: Record<string, unknown>;
}

export type AnalyticsSink = (event: AnalyticsEvent) => void;

interface PlausibleApi {
  (eventName: string, options?: { props?: Record<string, unknown> }): void;
}

declare global {
  interface Window {
    plausible?: PlausibleApi;
  }
}

const noopSink: AnalyticsSink = () => {};

let sink: AnalyticsSink = noopSink;

export function configureAnalytics(nextSink: AnalyticsSink) {
  sink = nextSink;
}

export function trackEvent(event: AnalyticsEvent) {
  sink(event);
}

/**
 * Default sink that forwards events to the Plausible script if it has loaded.
 * Marketing pages call this once during client-side hydration; it's a no-op
 * server-side and a no-op when the Plausible script isn't on the page (local
 * dev, ad-blockers, etc.).
 */
export const plausibleSink: AnalyticsSink = (event) => {
  if (typeof window === "undefined") return;
  const fn = window.plausible;
  if (typeof fn !== "function") return;
  fn(event.name, event.payload ? { props: event.payload } : undefined);
};

export function installPlausibleSink() {
  configureAnalytics(plausibleSink);
}

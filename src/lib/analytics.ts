export type AnalyticsEventName =
  | "quiz_start"
  | "question_answered"
  | "question_exit"
  | "quiz_complete"
  | "share_click"
  | "feedback_submit";

export interface AnalyticsEvent<T extends AnalyticsEventName = AnalyticsEventName> {
  name: T;
  payload?: Record<string, unknown>;
}

export type AnalyticsSink = (event: AnalyticsEvent) => void;

let sink: AnalyticsSink | null = null;

export function configureAnalytics(nextSink: AnalyticsSink) {
  sink = nextSink;
}

export function trackEvent(event: AnalyticsEvent) {
  if (sink) sink(event);
}

import { afterEach, describe, expect, it, vi } from "vitest";
import {
  configureAnalytics,
  plausibleSink,
  trackEvent,
} from "@/lib/analytics";

describe("analytics", () => {
  afterEach(() => {
    delete (window as { plausible?: unknown }).plausible;
    configureAnalytics(() => {});
  });

  it("forwards events to the configured sink", () => {
    const sink = vi.fn();
    configureAnalytics(sink);
    trackEvent({ name: "quiz_start", payload: { total: 24 } });
    expect(sink).toHaveBeenCalledExactlyOnceWith({
      name: "quiz_start",
      payload: { total: 24 },
    });
  });

  it("plausibleSink calls window.plausible(name, { props }) when loaded", () => {
    const fn = vi.fn();
    (window as { plausible?: unknown }).plausible = fn;
    plausibleSink({ name: "share_click", payload: { score: 18, total: 24 } });
    expect(fn).toHaveBeenCalledExactlyOnceWith("share_click", {
      props: { score: 18, total: 24 },
    });
  });

  it("plausibleSink is a no-op when window.plausible is missing", () => {
    expect(() => plausibleSink({ name: "quiz_complete" })).not.toThrow();
  });

  it("plausibleSink omits the props key when payload is empty", () => {
    const fn = vi.fn();
    (window as { plausible?: unknown }).plausible = fn;
    plausibleSink({ name: "quiz_complete" });
    expect(fn).toHaveBeenCalledExactlyOnceWith("quiz_complete", undefined);
  });
});

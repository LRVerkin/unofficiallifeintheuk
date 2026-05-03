// Test-time stub for the Astro Actions virtual module.
// Real action calls are exercised in Astro's dev/build runtime, not in Vitest.
// FeedbackForm tests pass an explicit `submitter` and never reach this code,
// but Vite still needs to resolve the import at transform time.
export const actions = {
  submitFeedback: async () => ({
    data: null as { ok: true } | null,
    error: null as { message?: string } | null,
  }),
};

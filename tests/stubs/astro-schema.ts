// Test-time stub for the Astro `astro:schema` virtual module. Astro re-exports
// its bundled zod here; under Vitest we just hand back the project's zod copy
// so test-loaded code can parse with the same API.
export { z } from "zod";

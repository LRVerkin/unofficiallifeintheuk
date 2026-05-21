import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://unofficiallifeinthe.uk",
  output: "server",
  // Opt out of @astrojs/cloudflare's default KV-backed sessions — this app
  // doesn't use server sessions (quiz state lives in browser sessionStorage).
  // Setting any driver here makes the adapter skip its KV auto-enable.
  session: { driver: "memory" },
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.endsWith("/404") && !page.endsWith("/404/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

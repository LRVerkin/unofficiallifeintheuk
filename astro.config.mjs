import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://unofficiallifeinthe.uk",
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
    sessionKVBindingName: "SESSION",
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

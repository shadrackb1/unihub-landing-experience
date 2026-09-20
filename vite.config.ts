// TanStack Start + Vite config.
// Compatible with the connected Lovable project (sandbox builds may pin their own Nitro preset).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
  },
});

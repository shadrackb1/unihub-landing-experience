// TanStack Start + Vite config.
// Compatible with the connected Lovable project (sandbox builds may pin their own Nitro preset).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import tsconfigPaths from "vite-tsconfig-paths";

const previewPreset = process.env["UNIHUB_PREVIEW_PRESET"];

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: previewPreset ? { preset: previewPreset } : { preset: "vercel" },
  plugins: [tsconfigPaths()],
});
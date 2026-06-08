// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // This is an SSR app. Outside the Lovable sandbox the config defaults to
  // skipping Nitro, leaving a client-only Vite build with no index.html — which
  // Vercel serves as a 404 at "/". Force Nitro on with the Vercel preset so the
  // build emits the Nitro Vercel output (config.json / nitro.json + server fn)
  // that Vercel's native TanStack Start support deploys. Vercel auto-detects the
  // preset during its build, but we pin it so local/CI builds match.
  nitro: { preset: "vercel" },
});

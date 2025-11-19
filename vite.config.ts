import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import obfuscator from "vite-plugin-javascript-obfuscator";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Only run obfuscation in production
    mode === "production" &&
      obfuscator({
        compact: true,
        controlFlowFlattening: true,
        deadCodeInjection: true,
        debugProtection: false,
        disableConsoleOutput: true,
        rotateStringArray: true,
        splitStrings: true,
        stringArray: true,
        stringArrayThreshold: 0.75,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild", // keep swc minification if you prefer
  },
}));

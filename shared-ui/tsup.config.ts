import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  external: ["react", "react-dom", "@infinity/shared-utils", "@infinity/shared-types"],
});

// vite.config.ts
import { defineConfig } from "file:///home/bhargav/Bhargav_Projects_Github/Microfrontend/devtoolhub/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43/node_modules/vite/dist/node/index.js";
import { svelte } from "file:///home/bhargav/Bhargav_Projects_Github/Microfrontend/devtoolhub/node_modules/.pnpm/@sveltejs+vite-plugin-svelte@3.1.2_svelte@4.2.20_vite@5.4.21_@types+node@20.19.43_/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import sveltePreprocess from "file:///home/bhargav/Bhargav_Projects_Github/Microfrontend/devtoolhub/node_modules/.pnpm/svelte-preprocess@6.0.5_@babel+core@7.29.7_postcss@8.5.15_svelte@4.2.20_typescript@5.5.4/node_modules/svelte-preprocess/dist/index.js";
import federation from "file:///home/bhargav/Bhargav_Projects_Github/Microfrontend/devtoolhub/node_modules/.pnpm/@originjs+vite-plugin-federation@1.4.1/node_modules/@originjs/vite-plugin-federation/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    federation({
      name: "regexPlayground",
      filename: "remoteEntry.js",
      exposes: { "./App": "./src/App.svelte" },
      shared: {
        svelte: { singleton: true, requiredVersion: "^4.2.0" },
        "@devtoolhub/event-bus": { singleton: true },
        "@devtoolhub/shared-types": { singleton: true }
      }
    })
  ],
  server: { port: 3004, strictPort: true },
  build: { modulePreload: false, target: "esnext", minify: false, cssCodeSplit: false }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9iaGFyZ2F2L0JoYXJnYXZfUHJvamVjdHNfR2l0aHViL01pY3JvZnJvbnRlbmQvZGV2dG9vbGh1Yi9wbHVnaW5zL3JlZ2V4LXBsYXlncm91bmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2JoYXJnYXYvQmhhcmdhdl9Qcm9qZWN0c19HaXRodWIvTWljcm9mcm9udGVuZC9kZXZ0b29saHViL3BsdWdpbnMvcmVnZXgtcGxheWdyb3VuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9iaGFyZ2F2L0JoYXJnYXZfUHJvamVjdHNfR2l0aHViL01pY3JvZnJvbnRlbmQvZGV2dG9vbGh1Yi9wbHVnaW5zL3JlZ2V4LXBsYXlncm91bmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHN2ZWx0ZSB9IGZyb20gJ0BzdmVsdGVqcy92aXRlLXBsdWdpbi1zdmVsdGUnO1xuaW1wb3J0IHN2ZWx0ZVByZXByb2Nlc3MgZnJvbSAnc3ZlbHRlLXByZXByb2Nlc3MnO1xuaW1wb3J0IGZlZGVyYXRpb24gZnJvbSAnQG9yaWdpbmpzL3ZpdGUtcGx1Z2luLWZlZGVyYXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZlbHRlKHsgcHJlcHJvY2Vzczogc3ZlbHRlUHJlcHJvY2VzcygpIH0pLFxuICAgIGZlZGVyYXRpb24oe1xuICAgICAgbmFtZTogJ3JlZ2V4UGxheWdyb3VuZCcsXG4gICAgICBmaWxlbmFtZTogJ3JlbW90ZUVudHJ5LmpzJyxcbiAgICAgIGV4cG9zZXM6IHsgJy4vQXBwJzogJy4vc3JjL0FwcC5zdmVsdGUnIH0sXG4gICAgICBzaGFyZWQ6IHtcbiAgICAgICAgc3ZlbHRlOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjQuMi4wJyB9LFxuICAgICAgICAnQGRldnRvb2xodWIvZXZlbnQtYnVzJzogeyBzaW5nbGV0b246IHRydWUgfSxcbiAgICAgICAgJ0BkZXZ0b29saHViL3NoYXJlZC10eXBlcyc6IHsgc2luZ2xldG9uOiB0cnVlIH0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzZXJ2ZXI6IHsgcG9ydDogMzAwNCwgc3RyaWN0UG9ydDogdHJ1ZSB9LFxuICBidWlsZDogeyBtb2R1bGVQcmVsb2FkOiBmYWxzZSwgdGFyZ2V0OiAnZXNuZXh0JywgbWluaWZ5OiBmYWxzZSwgY3NzQ29kZVNwbGl0OiBmYWxzZSB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXViLFNBQVMsb0JBQW9CO0FBQ3BkLFNBQVMsY0FBYztBQUN2QixPQUFPLHNCQUFzQjtBQUM3QixPQUFPLGdCQUFnQjtBQUV2QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPLEVBQUUsWUFBWSxpQkFBaUIsRUFBRSxDQUFDO0FBQUEsSUFDekMsV0FBVztBQUFBLE1BQ1QsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsU0FBUyxFQUFFLFNBQVMsbUJBQW1CO0FBQUEsTUFDdkMsUUFBUTtBQUFBLFFBQ04sUUFBUSxFQUFFLFdBQVcsTUFBTSxpQkFBaUIsU0FBUztBQUFBLFFBQ3JELHlCQUF5QixFQUFFLFdBQVcsS0FBSztBQUFBLFFBQzNDLDRCQUE0QixFQUFFLFdBQVcsS0FBSztBQUFBLE1BQ2hEO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUSxFQUFFLE1BQU0sTUFBTSxZQUFZLEtBQUs7QUFBQSxFQUN2QyxPQUFPLEVBQUUsZUFBZSxPQUFPLFFBQVEsVUFBVSxRQUFRLE9BQU8sY0FBYyxNQUFNO0FBQ3RGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==

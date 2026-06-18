# DevToolHub

A developer toolbox plugin marketplace built with **Micro Frontend architecture** using Vite Module Federation. Plugins are discovered at runtime from a registry API and loaded dynamically — no host rebuild required when adding new plugins.

## Architecture

```
devtoolhub/
├── apps/
│   └── host-shell/          # React 19 shell app (port 3000)
├── plugins/
│   ├── api-tester/          # React  — REST API client  (port 3001)
│   ├── json-formatter/      # Vue 3  — JSON tools       (port 3002)
│   ├── jwt-decoder/         # React  — JWT inspector    (port 3003)
│   ├── regex-playground/    # Svelte — Regex tester     (port 3004)
│   ├── markdown-editor/     # React  — Markdown preview (port 3005)
│   └── uuid-generator/      # React  — UUID generator   (port 3006)
├── packages/
│   ├── shared-types/        # TypeScript contracts (no runtime)
│   ├── event-bus/           # Typed pub/sub singleton
│   ├── auth-sdk/            # React AuthContext + useAuth hook
│   ├── http-sdk/            # Pre-configured Axios instance
│   └── shared-ui/           # Shared React components
├── registry/                # Express mock plugin registry (port 4000)
├── federation.d.ts          # Typed SharedModules augmentation
└── pnpm-workspace.yaml
```

## Key Concepts

### Dynamic Runtime Federation

The host shell has **`remotes: {}`** (empty) in its Vite config. Plugin remotes are registered at runtime using federation globals:

```ts
__federation_method_setRemote(scope, { url: () => Promise.resolve(remoteUrl), format: 'esm', from: 'vite' });
const module = await __federation_method_getRemote(scope, exposedModule);
return __federation_method_unwrapDefault(module);
```

This means the host can load any plugin listed in the registry without rebuilding.

### Multi-Framework Support

React, Vue 3, and Svelte 4 plugins all run inside the React host shell via adapter wrappers:

| Framework | Wrapper | Mount API |
|-----------|---------|-----------|
| React | direct | React reconciler |
| Vue 3 | `VuePluginWrapper` | `createApp().mount()` |
| Svelte 4 | `SveltePluginWrapper` | `new Component({ target })` |

### Singleton Shared Modules

All packages listed in `shared` with `singleton: true` share a single instance across the host and all plugins:

- `react`, `react-dom`, `react/jsx-runtime`
- `@devtoolhub/event-bus` — one event bus, all apps subscribe to it
- `@devtoolhub/auth-sdk` — one auth context, plugins call `useAuth()`
- `@devtoolhub/http-sdk` — one Axios instance, token set once on login

### Cross-Plugin Event Bus

Typed events defined in `shared-types`:

```ts
type EventName = 'plugin-installed' | 'plugin-uninstalled' | 'token-updated' | 'theme-changed' | 'plugin-error';
```

Example: login in the host → `token-updated` emitted → JWT Decoder plugin auto-refreshes its decoded view.

### CSS Isolation

- React plugins: CSS Modules (`.module.css`)
- Vue plugin: `<style module>`
- Svelte plugin: scoped `<style>` (default)

Class name collisions between plugins are impossible.

### Error Boundaries

Each plugin is wrapped in `PluginBoundary` (React class component ErrorBoundary). A plugin crash emits `plugin-error` on the event bus and shows a "Retry" fallback — all other plugins continue running.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+

```bash
npm install -g pnpm
```

### Install dependencies

```bash
cd devtoolhub
pnpm install
```

### Run (development workflow)

> **Note:** `@originjs/vite-plugin-federation` only injects federation globals in **build output**, not in `vite dev` mode. Plugins must be built and previewed.

**Terminal 1 — Registry**
```bash
pnpm --filter registry dev
# Serves plugin metadata at http://localhost:4000/plugins
```

**Terminal 2 — Build and preview all plugins**
```bash
pnpm build:plugins
pnpm preview:plugins
# Starts remoteEntry.js servers on ports 3001–3006
```

**Terminal 3 — Host shell**
```bash
pnpm build:host
pnpm preview:host
# Opens at http://localhost:3000
```

### One-shot build everything

```bash
pnpm build:plugins    # all 6 plugins in parallel
pnpm build:host       # host shell
```

> Packages (`shared-types`, `event-bus`, `auth-sdk`, `http-sdk`, `shared-ui`) are consumed directly as TypeScript workspace source — no separate build step needed. Run `pnpm typecheck:packages` to type-check them.

## Plugin Registry API

The mock registry runs on port 4000:

| Endpoint | Response |
|----------|----------|
| `GET /plugins` | All 6 plugin metadata entries |
| `GET /plugins/:id` | Single plugin or 404 |

Each entry includes `remoteUrl`, `scope`, `exposedModule`, and `framework` — everything the host needs to dynamically load the plugin.

## Plugin Development

To add a new plugin:

1. Create `plugins/my-plugin/` with a `vite.config.ts` that exposes `./App`
2. Add an entry to `registry/plugins.json` with the correct `remoteUrl`, `scope`, and `framework`
3. Build the plugin and restart its preview server — **no host changes required**

### Plugin contract

Every plugin exposes a single default export:

```ts
export default function MyPlugin({ pluginId }: { pluginId: string }) { ... }
```

Plugins may call `useAuth()` from `@devtoolhub/auth-sdk` and subscribe to events via `eventBus` from `@devtoolhub/event-bus`.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces |
| Federation | @originjs/vite-plugin-federation 1.4 |
| Host framework | React 19 + Vite 6 |
| Routing | React Router 7 (`createBrowserRouter`) |
| State management | Zustand with `persist` middleware |
| Data fetching | TanStack Query v5 |
| Vue plugin | Vue 3 + @vitejs/plugin-vue |
| Svelte plugin | Svelte 4 + @sveltejs/vite-plugin-svelte |
| HTTP client | Axios (shared singleton) |
| TypeScript | 5.5, strict mode |

## Port Map

| Service | Port | URL |
|---------|------|-----|
| Host shell | 3000 | http://localhost:3000 |
| api-tester | 3001 | http://localhost:3001 |
| json-formatter | 3002 | http://localhost:3002 |
| jwt-decoder | 3003 | http://localhost:3003 |
| regex-playground | 3004 | http://localhost:3004 |
| markdown-editor | 3005 | http://localhost:3005 |
| uuid-generator | 3006 | http://localhost:3006 |
| Registry API | 4000 | http://localhost:4000 |

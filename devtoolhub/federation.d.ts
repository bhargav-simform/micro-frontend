/**
 * @originjs/vite-plugin-federation@1.4.x ships with `singleton` and
 * `requiredVersion` commented out in SharedConfig. This augmentation
 * restores them so vite.config.ts files can use them without `as any` casts.
 *
 * The leading `export {}` makes this a module file (not an ambient script),
 * which is required for `declare module` to be treated as augmentation
 * rather than a replacement of the module's ambient declaration.
 */
export {};

declare module '@originjs/vite-plugin-federation' {
  interface SharedConfig {
    singleton?: boolean;
    requiredVersion?: string;
  }
}

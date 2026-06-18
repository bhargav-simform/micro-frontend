declare module '__federation__' {
  export function __federation_method_setRemote(
    name: string,
    config: { url: () => Promise<string>; format: string; from: string }
  ): void;

  export function __federation_method_getRemote(
    name: string,
    expose: string
  ): Promise<unknown>;

  export function __federation_method_unwrapDefault(module: unknown): unknown;

  export function __federation_method_ensure(remoteId: string): Promise<void>;

  export function __federation_method_wrapDefault(
    module: unknown,
    need: boolean
  ): unknown;
}

interface ImportMetaEnv {
  readonly VITE_REGISTRY_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import { useEffect, useRef } from 'react';

interface SvelteComponentConstructor {
  new (options: { target: HTMLElement; props?: Record<string, unknown> }): {
    $destroy(): void;
  };
}

interface Props {
  component: unknown;
  pluginId: string;
}

export function SveltePluginWrapper({ component, pluginId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const SvelteComp = component as SvelteComponentConstructor;
    const instance = new SvelteComp({
      target: containerRef.current,
      props: { pluginId },
    });
    return () => instance.$destroy();
  }, [component, pluginId]);

  return <div ref={containerRef} data-plugin-id={pluginId} data-framework="svelte" />;
}

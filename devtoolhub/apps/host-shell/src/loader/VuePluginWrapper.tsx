import { useEffect, useRef } from 'react';
import { createApp } from 'vue';
import type { Component } from 'vue';

interface Props {
  component: unknown;
  pluginId: string;
}

export function VuePluginWrapper({ component, pluginId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const app = createApp(component as Component, { pluginId });
    app.mount(containerRef.current);
    return () => app.unmount();
  }, [component, pluginId]);

  return <div ref={containerRef} data-plugin-id={pluginId} data-framework="vue" />;
}

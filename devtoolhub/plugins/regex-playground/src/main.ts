import App from './App.svelte';

new App({
  target: document.getElementById('app')!,
  props: { pluginId: 'regex-playground' },
});

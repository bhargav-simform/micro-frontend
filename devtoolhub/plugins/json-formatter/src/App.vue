<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ pluginId: string }>();

const rawJson = ref('');
const output = ref('');
const error = ref('');
const lastAction = ref('');
const copied = ref(false);

function formatJson() {
  try {
    const parsed = JSON.parse(rawJson.value);
    output.value = JSON.stringify(parsed, null, 2);
    error.value = '';
    lastAction.value = 'beautify';
  } catch (e) {
    error.value = (e as Error).message;
    output.value = '';
  }
}

function minifyJson() {
  try {
    const parsed = JSON.parse(rawJson.value);
    output.value = JSON.stringify(parsed);
    error.value = '';
    lastAction.value = 'minify';
  } catch (e) {
    error.value = (e as Error).message;
    output.value = '';
  }
}

function validateJson() {
  try {
    JSON.parse(rawJson.value);
    error.value = '';
    output.value = '✅ Valid JSON!';
    lastAction.value = 'validate';
  } catch (e) {
    error.value = (e as Error).message;
    output.value = '';
  }
}

async function copyOutput() {
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

function downloadJson() {
  if (!output.value) return;
  const blob = new Blob([output.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'output.json';
  a.click();
  URL.revokeObjectURL(url);
}

function loadSample() {
  rawJson.value = JSON.stringify({
    name: 'DevToolHub',
    version: '1.0.0',
    plugins: ['api-tester', 'json-formatter', 'jwt-decoder'],
    meta: { framework: 'vue', port: 3002 }
  });
}
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <h2 :class="$style.title">📋 JSON Formatter</h2>
      <span :class="$style.frameworkBadge">Vue 3</span>
    </div>

    <div :class="$style.toolbar">
      <button :class="$style.actionBtn" @click="formatJson">Beautify</button>
      <button :class="$style.actionBtn" @click="minifyJson">Minify</button>
      <button :class="$style.actionBtn" @click="validateJson">Validate</button>
      <button :class="$style.ghostBtn" @click="loadSample">Load Sample</button>
    </div>

    <div :class="$style.editor">
      <div :class="$style.pane">
        <div :class="$style.paneLabel">Input JSON</div>
        <textarea
          :class="$style.textarea"
          v-model="rawJson"
          placeholder="Paste JSON here..."
          :rows="12"
          spellcheck="false"
        />
      </div>
      <div :class="$style.pane">
        <div :class="$style.paneLabel">
          Output
          <div :class="$style.outputActions" v-if="output">
            <button :class="$style.smallBtn" @click="copyOutput">{{ copied ? '✅' : '📋' }}</button>
            <button :class="$style.smallBtn" @click="downloadJson">⬇️</button>
          </div>
        </div>
        <div v-if="error" :class="$style.error">{{ error }}</div>
        <pre v-else :class="$style.outputPre">{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<style module>
.container { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; font-family: system-ui, sans-serif; }

.header { display: flex; align-items: center; gap: 0.75rem; }
.title { margin: 0; font-size: 1.25rem; font-weight: 700; }
.frameworkBadge { background: #dcfce7; color: #166534; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; }

.toolbar { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.actionBtn {
  padding: 0.4rem 1rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.actionBtn:hover { background: #4f46e5; }

.ghostBtn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}

.ghostBtn:hover { background: #f9fafb; }

.editor { display: flex; gap: 0.75rem; }

.pane { flex: 1; display: flex; flex-direction: column; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }

.paneLabel {
  padding: 0.4rem 0.75rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.72rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.outputActions { display: flex; gap: 0.25rem; }

.smallBtn {
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 0.1rem 0.4rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.smallBtn:hover { background: #e5e7eb; }

.textarea {
  padding: 0.75rem;
  border: none;
  outline: none;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  resize: none;
  flex: 1;
  background: #1e1e2e;
  color: #cdd6f4;
  min-height: 300px;
}

.outputPre {
  margin: 0;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  background: #1e1e2e;
  color: #cdd6f4;
  overflow: auto;
  flex: 1;
  min-height: 300px;
  white-space: pre-wrap;
  word-break: break-all;
}

.error { padding: 0.75rem; color: #ef4444; font-size: 0.825rem; background: #fee2e2; flex: 1; }
</style>

<template>
  <div class="vue-widget">
    <div class="vue-badge">Vue 3 MFE</div>
    <p class="step-label">Workflow Step: <strong>{{ workflowStep || 'none' }}</strong></p>
    <p class="host-msg">Host message: <em>{{ hostMessage }}</em></p>
    <button @click="sendToHost">Notify React Host</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  workflowStep?: string
}>()

const hostMessage = ref('(none yet)')

function handleHostEvent(e: Event) {
  const detail = (e as CustomEvent<{ message: string }>).detail
  hostMessage.value = detail.message
}

function sendToHost() {
  const event = new CustomEvent('vue-mfe:action', {
    bubbles: true,
    composed: true,
    detail: { step: props.workflowStep ?? 'unknown', action: 'vue-button-clicked', ts: Date.now() },
  })
  // Walk up to find the custom element host and dispatch from there
  const host = document.querySelector('vue-widget') as HTMLElement | null
  if (host) {
    host.dispatchEvent(event)
  }
}

onMounted(() => {
  window.addEventListener('host:message', handleHostEvent)
})

onUnmounted(() => {
  window.removeEventListener('host:message', handleHostEvent)
})
</script>

<style>
.vue-widget {
  background: #f0fdf4;
  border: 2px solid #16a34a;
  border-radius: 8px;
  padding: 16px 24px;
  font-family: system-ui, sans-serif;
  max-width: 400px;
}

.vue-badge {
  display: inline-block;
  background: #16a34a;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  margin-bottom: 8px;
}

.step-label,
.host-msg {
  margin: 4px 0;
  font-size: 13px;
  color: #374151;
}

button {
  margin-top: 10px;
  background: #16a34a;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

button:hover {
  background: #15803d;
}
</style>

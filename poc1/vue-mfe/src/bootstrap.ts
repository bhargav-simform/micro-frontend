import { defineCustomElement } from 'vue'
import VueWidget from './components/VueWidget.ce.vue'

const VueWidgetElement = defineCustomElement(VueWidget)

if (!customElements.get('vue-widget')) {
  customElements.define('vue-widget', VueWidgetElement)
}

export const VUE_WIDGET_TAG = 'vue-widget' as const

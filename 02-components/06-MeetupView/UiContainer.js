import { defineComponent } from './vendor/vue.esm-browser.js';

export const UiContainer = defineComponent({
  name: 'UiContainer',

  template: `
    <div class="container">
      <slot />
    </div>`,
});

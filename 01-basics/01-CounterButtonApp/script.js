import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const app = createApp({});

const Counter = defineComponent({
  data() {
    return {
      counter: 0,
    };
  },
  methods: {
    increment() {
      this.counter++;
    },
  },
  template: '<button type="button" @click="increment">{{ counter }}</button>',
});

app.component('counter', Counter);

app.mount('#app');

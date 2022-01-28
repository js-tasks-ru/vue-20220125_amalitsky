import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const app = createApp({});

const template = `
  <div class="row">
    <div class="col">
      <input type="number" step="1" v-model="a"/>
    </div>

    <div class="col" style="display: flex; flex-direction: column; font-family: emoji">
      <label><input type="radio" value="sum" v-model="operator"/> ➕</label>
      <label><input type="radio" value="subtract" v-model="operator"/> ➖</label>
      <label><input type="radio" value="multiply" v-model="operator"/> ✖</label>
      <label><input type="radio" value="divide" v-model="operator"/> ➗</label>
    </div>

    <div class="col">
      <input type="number" step="1" v-model="b"/>
    </div>

    <div class="col">=</div>

    <output class="col">{{ result }}</output>
  </div>`;

const Calculator = defineComponent({
  data() {
    return {
      operator: 'sum',
      a: 0,
      b: 0,
    };
  },
  computed: {
    result() {
      const { operator, a, b } = this;

      switch (operator) {
        case 'sum':
          return a + b;

        case 'subtract':
          return a - b;

        case 'multiply':
          return a * b;

        case 'divide':
          return a / b;
      }

      // should not happen but makes linter happy
      return NaN;
    },
  },
  template,
});

app.component('calculator', Calculator);

app.mount('#app');

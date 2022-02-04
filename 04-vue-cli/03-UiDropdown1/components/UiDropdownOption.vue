<template>
  <button
    class="dropdown__item"
    role="option"
    type="button"
    @click="select()"
  >
    <ui-icon
      v-if="option.icon"
      :icon="option.icon"
      class="dropdown__icon"
    />
    {{ option.text }}
  </button>

</template>

<script>
import UiIcon from './UiIcon';

const EVENT = 'optionSelection';

export default {
  name: 'UiDropdownOption',

  components: {
    UiIcon,
  },

  emits: [EVENT],

  props: {
    option: {
      required: true,
      type: Object,
    },
  },

  methods: {
    select() {
      this.$emit(EVENT, this.option);
    },
  }
}

</script>

<style scope>
  .container {
    position: relative;
  }

  .dropdown__item {
    padding: 8px 16px;
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    background-color: var(--white);
    box-shadow: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition-duration: 0.2s;
    transition-property: background-color, border-color, color;
    outline: none;
    text-decoration: none;
  }

  .dropdown__item:hover,
  .dropdown__item:focus {
    background-color: var(--grey-light);
  }

</style>

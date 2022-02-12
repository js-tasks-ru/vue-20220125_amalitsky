<template>
  <component
    :is="tag"
    :class="classes"
    v-bind="attributes"
  >
    <slot/>
  </component>
</template>

<script>
export default {
  name: 'UiButton',

  props: {
    tag: {
      type: [Object, String],
      default: 'button',
    },
    variant: {
      type: String,
      default: 'secondary',
    },
    block: {
      type: Boolean,
    },
  },

  computed: {
    classes() {
      const classes = [
        `button_${this.variant}`
      ];

      if (this.block) {
        classes.push('button_block');
      }

      return classes;
    },
    attributes() {
      if (this.tag === 'button') {
        return {
          type: 'button',
        };
      }

      return null;
    },
  },
};
</script>

<style scoped>
.button {
  display: inline-block;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: initial;
  text-align: center;
  border: 4px solid transparent;
  transition-duration: 0.2s;
  transition-property: background-color, border-color, color;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;
}

.button.button_block {
  display: block;
  width: 100%;
}

.button_primary {
  background-color: var(--blue);
  border-color: var(--blue);
  color: var(--white);
}

.button_primary:hover {
  background-color: var(--blue-light);
  border-color: var(--blue-light);
}

.button_secondary {
  background-color: var(--white);
  border-color: var(--blue);
  color: var(--blue);
}

.button_secondary:hover {
  border-color: var(--blue-light);
}

.button_danger {
  background-color: var(--white);
  border-color: var(--red);
  color: var(--red);
}

.button_danger:hover {
  border-color: var(--red-light);
}
</style>

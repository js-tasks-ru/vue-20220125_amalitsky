<template>
  <button @click="increment()">{{ localCount }}</button>
</template>

<script>
export default {
  name: 'CounterButton',

  props: {
    count: {
      type: Number,
      default: 0,
    },
  },

  emits: ['update:count'],

  data() {
    return {
      localCount: this.count,
    };
  },

  watch: {
    count(newCountValue) {
      this.localCount = newCountValue;
    },
  },

  methods: {
    increment() {
      this.localCount++;

      this.$emit('update:count', this.localCount);
    },
  },
};
</script>

<style scoped>

button {
  padding: 0.5rem 1rem;
}

</style>

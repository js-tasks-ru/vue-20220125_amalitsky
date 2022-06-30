<template>
  <div class="pagination-container">
    <slot
      v-for="item in pageItems"
      :item="item"
    ></slot>
  </div>
</template>

<script>
export default {
  name: 'UiPaginationView',

  props: {
    page: {
      type: Number,
      required: true,
      validator: (value) => value > 0,
    },
    perPage: {
      type: Number,
      required: true,
      validator: (value) => value > 0,
    },
    items: {
      type: Array,
      required: true,
    },
  },

  computed: {
    pageItems() {
      const { items, perPage, page } = this;

      const start = (page - 1) * perPage;
      const end = start + perPage;

      return items.slice(start, end);
    },
  },
};
</script>

<style></style>

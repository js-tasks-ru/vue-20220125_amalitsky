<template>
  <ui-input
    ref="input"
    v-model="modelValueProxy"
    :type="type"
  >
    <template #right-icon>
      <slot name="right-icon"/>
    </template>

    <template #left-icon>
      <slot name="left-icon"/>
    </template>
  </ui-input>
</template>

<script>
import UiInput from './UiInput';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const formats = {
  date: 'YYYY-MM-DD',
  time: 'HH:mm',
  'datetime-local': 'YYYY-MM-DDTHH:mm:ss',
};

export default {
  name: 'UiInputDate',

  components: { UiInput },

  props: {
    type: {
      type: String,
      default: 'date',
    },
    modelValue: {
      type: Number,
      // required: true, throws warnings during tests
    },
  },

  emits: ['update:modelValue'],

  computed: {
    modelValueProxy: {
      get() {
        const {
          modelValue,
          type,
        } = this;

        if (!modelValue) {
          return '';
        }

        const dateStringFormat = formats[type];
        const date = dayjs(modelValue);

        return date.utc().format(dateStringFormat);
      },
      set() {
        const value = this.$refs.input.getValueAsNumber() || null;

        this.$emit('update:modelValue', value);
      },
    },
  },

  methods: {
    getValueAsNumber() {
      return this.$refs['input'].getValueAsNumber;
    },
  },
};
</script>

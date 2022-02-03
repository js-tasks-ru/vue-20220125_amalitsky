<template>
  <div v-once class="toast" :class="toastClass">
    <ui-icon v-once class="toast__icon" :icon="toastIcon" />
    <span v-once>{{ message }}</span>
    <!--<button v-if="closeButton" @click="$emit('close')">x</button>-->
  </div>
</template>

<script>
import UiIcon from './UiIcon';

const typeIconsHash = {
  success: 'check-circle',
  error: 'alert-circle',
};

export default {
  name: 'Toast',

  components: {
    UiIcon,
  },

  props: {
    message: String,
    type: String,
    closeButton: {
      type: Boolean,
      default: false,
    }
  },

  emits: ['close'],

  computed: {
    toastClass() {
      return `toast_${ this.type }`;
    },
    toastIcon() {
      return typeIconsHash[this.type];
    },
  },
};
</script>

<style scoped>
.toast {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  font-size: 18px;
  line-height: 28px;
  width: auto;
}

.toast__icon {
  margin-right: 12px;
}

.toast.toast_success {
  color: var(--green);
}

.toast.toast_error {
  color: var(--red);
}
</style>

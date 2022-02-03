<template>
  <div class="toasts">
    <toast
      v-for="[id, toast] in toasts"
      :key="id"
      :message="toast.message"
      :type="toast.type"
      :close-button="toast.closeButton"
      @close="remove(toast)"
    />
  </div>
</template>

<script>
import Toast from './Toast';

export default {
  name: 'TheToaster',

  components: {
    Toast,
  },

  data() {
    return {
      counter: 0,
      toasts: new Map(),
      timeouts: [],
    };
  },

  beforeUnmount() {
    this.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
  },

  methods: {
    add(toast, timeout, closeButton = false) {
      toast.id = this.counter++;
      toast.closeButton = closeButton;

      this.toasts.set(toast.id, toast);

      if (timeout) {
        const timeoutId = setTimeout(() => this.remove(toast), timeout);

        this.timeouts.push(timeoutId);
      }
    },
    remove(toast) {
      this.toasts.delete(toast.id);
    },
    success(message, timeout = 5000) {
      this.add({
        message,
        type: 'success',
      }, timeout);
    },
    error(message, timeout = 5000) {
      this.add({
        message,
        type: 'error',
      }, timeout, true);
    },
  },


};
</script>

<style scoped>
.toasts {
  position: fixed;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  white-space: pre-wrap;
  z-index: 999;
}

@media all and (min-width: 992px) {
  .toasts {
    bottom: 72px;
    right: 112px;
  }
}

.toast + .toast {
  margin-top: 20px;
}

</style>

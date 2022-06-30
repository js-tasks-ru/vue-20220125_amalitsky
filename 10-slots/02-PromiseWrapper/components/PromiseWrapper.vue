<script>
const STATUS_PENDING = 'STATUS_PENDING';
const STATUS_NA = 'STATUS_NA';
const STATUS_RESOLVED = 'STATUS_RESOLVED';
const STATUS_REJECTED = 'STATUS_REJECTED';

export default {
  name: 'PromiseWrapper',

  props: {
    promise: {
      type: Promise,
      required: true,
    },
  },

  data() {
    return {
      counter: 0,
      status: STATUS_NA,
      result: null,
      error: null,
    };
  },

  watch: {
    promise: {
      handler() {
        this.init();
      },
      immediate: true,
    },
  },

  methods: {
    init() {
      this.counter++;
      this.result = null;
      this.error = null;
      this.status = STATUS_PENDING;

      const { counter } = this;

      this.promise
        .then(result => this.onResolution(counter, result))
        .catch(error => this.onError(counter, error))
    },

    onResolution(counter, result) {
      if (counter !== this.counter) {
        return;
      }

      this.status = STATUS_RESOLVED;
      this.result = result;
    },

    onError(counter, error) {
      if (counter !== this.counter) {
        return;
      }

      this.status = STATUS_REJECTED;
      this.error = error;
    },
  },

  // tried with v-if first but that failed tests for some reason
  render() {
    const { status } = this;

    switch (status) {
      case STATUS_PENDING:
        return this.$slots.pending();

      case STATUS_RESOLVED:
        return this.$slots.fulfilled({ result: this.result });

      case STATUS_REJECTED:
        return this.$slots.rejected({ error: this.error });
    }

    return STATUS_NA;
  },
};
</script>

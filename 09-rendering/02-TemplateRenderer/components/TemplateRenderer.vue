<script>
import { compile, h, defineComponent } from 'vue';

export default {
  name: 'TemplateRenderer',

  props: {
    template: {
      type: String,
      required: true,
    },

    bindings: {
      type: Object,
      default: () => ({}),
    },

    components: {
      type: [Object, Array],
      default: () => [],
    },
  },

  render(props) {
    const { components, bindings } = props;

    const renderFunction = compile(props.template);

    const Component = defineComponent({
      components,

      props: {
        bindings: {
          tpe: Object,
          default: () => ({}),
        },
      },

      render: renderFunction,
    });

    return h(Component, {
      bindings,
    });
  },
};
</script>

import { defineComponent } from './vendor/vue.esm-browser.js';

export const MeetupCover = defineComponent({
  name: 'MeetupCover',

  props: {
    title: String,
    image: String,
  },

  computed: {
    coverStyles() {
      const { image } = this;

      if (image) {
        return {
          '--bg-url': `url(${image})`,
        };
      }

      return null;
    },
  },

  template: `
    <div class="meetup-cover" :style="coverStyles">
        <h1 class="meetup-cover__title">{{ title || '' }}</h1>
    </div>`,
});

import { defineComponent } from './vendor/vue.esm-browser.js';

export const MeetupDescription = defineComponent({
  name: 'MeetupDescription',

  props: {
    description: String,
  },

  template:
    `<p class="meetup-description">{{ description ?? '' }}</p>`,
});

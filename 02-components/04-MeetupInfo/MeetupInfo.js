import { defineComponent } from './vendor/vue.esm-browser.js';

export const MeetupInfo = defineComponent({
  name: 'MeetupInfo',

  props: {
    organizer: String,
    place: String,
    date: {
      type: Number,
      required: true,
    },
  },

  computed: {
    dateLabel() {
      const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };

      return new Date(this.date).toLocaleDateString(navigator.language, dateOptions);
    },

    isoDateOnly() {
      return new Date(this.date).toISOString().slice(0, 10);
    },
  },

  template: `
    <ul class="meetup-info">
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-user.svg" />
        {{ organizer }}
      </li>
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-map.svg" />
        {{ place }}
      </li>
      <li>
        <img class="icon meetup-info__icon" alt="icon" src="/assets/icons/icon-cal-lg.svg" />
        <time :datetime="isoDateOnly">{{ dateLabel }}</time>
      </li>
    </ul>`,
});

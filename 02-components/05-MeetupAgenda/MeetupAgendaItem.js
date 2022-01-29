import { defineComponent } from './vendor/vue.esm-browser.js';
import { agendaItemIcons, agendaItemDefaultTitles } from './meetupService.js';

const EVENT_TYPE_ICON_URL_PREFIX = '/assets/icons/icon-';

export const MeetupAgendaItem = defineComponent({
  name: 'MeetupAgendaItem',

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  computed: {
    title() {
      const { title, type } = this.agendaItem;

      return title || agendaItemDefaultTitles[type];
    },
    timeSpan() {
      const {
        startsAt,
        endsAt,
      } = this.agendaItem;

      return `${startsAt} - ${endsAt}`;
    },
    typeIconUrl() {
      const { type } = this.agendaItem;
      const iconFileSuffix = agendaItemIcons[type];

      return `${ EVENT_TYPE_ICON_URL_PREFIX }${ iconFileSuffix }.svg`
    },
  },

  template: `
    <div class="agenda-item">
      <div class="agenda-item__col">
        <img :src="typeIconUrl" class="icon" :alt="agendaItem.type" />
      </div>
      <div class="agenda-item__col">{{ timeSpan }}</div>
      <div class="agenda-item__col">
        <h3 class="agenda-item__title">{{ title }}</h3>
        <p v-if="agendaItem.type === 'talk'" class="agenda-item__talk">
          <span>{{ agendaItem.speaker }}</span>
          <span class="agenda-item__dot"></span>
          <span class="agenda-item__lang"> {{ agendaItem.language }}</span>
        </p>
        <p v-if="agendaItem.description">{{ agendaItem.description }}</p>
      </div>
    </div>`,
});

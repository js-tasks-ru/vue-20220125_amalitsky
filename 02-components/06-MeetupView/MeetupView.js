import { defineComponent } from './vendor/vue.esm-browser.js';
import { UiAlert } from './UiAlert.js';
import { UiContainer } from './UiContainer.js';
import { MeetupCover } from '../03-MeetupCover/MeetupCover.js';
import { MeetupDescription } from '../02-MeetupDescription/MeetupDescription.js';
import { MeetupInfo } from '../04-MeetupInfo/MeetupInfo.js';
import { MeetupAgenda } from '../05-MeetupAgenda/MeetupAgenda.js';

export const MeetupView = defineComponent({
  name: 'MeetupView',

  components: {
    MeetupCover,
    MeetupDescription,
    MeetupInfo,
    MeetupAgenda,
    UiAlert,
    UiContainer,
  },

  props: {
    meetup: {
      type: Object,
      required: true,
    },
  },

  computed: {
    haveAgenda() {
      const { agenda } = this.meetup;

      return agenda?.length > 0 || false;
    },
  },

  template: `
    <div>
      <MeetupCover :title="meetup.title" :image="meetup.image"/>

      <ui-container>
        <div class="meetup">
          <div class="meetup__content">
            <h3>Описание</h3>
            <MeetupDescription :description="meetup.description"/>

            <h3>Программа</h3>
            <MeetupAgenda
              v-if="haveAgenda"
              :agenda="meetup.agenda"
            />
            <ui-alert v-if="!haveAgenda">Программа пока пуста...</ui-alert>
          </div>
          <div class="meetup__aside">
            <MeetupInfo
              :organizer="meetup.organizer"
              :place="meetup.place"
              :date="meetup.date"
            />
          </div>
        </div>
      </ui-container>
    </div>`,
});

export default MeetupInfo;

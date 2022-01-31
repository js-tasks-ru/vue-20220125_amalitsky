import { defineComponent } from './vendor/vue.esm-browser.js';
import UiContainer from './UiContainer.js';
import UiAlert from './UiAlert.js';
import { fetchMeetupById } from './meetupService.js';
import { MeetupView } from '../06-MeetupView/MeetupView.js';

const PageMeetup = defineComponent({
  name: 'PageMeetup',

  components: {
    UiAlert,
    UiContainer,
    MeetupView,
  },

  props: {
    meetupId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      error: '',
      meetup: null,
    };
  },

  watch: {
    meetupId() {
      this.loadMeetupData();
    },
  },

  methods: {
    async loadMeetupData() {
      const { loading, meetupId } = this;

      if (loading) {
        return Promise.reject('Currently loading');
      }

      // if for whatever reason meetupId wasn't passed even though it's marked as required
      if (meetupId === undefined) {
        return Promise.reject('MeetupId is not set');
      }

      this.loading = true;
      this.error = '';
      this.meetup = null;

      try {
        this.meetup = await fetchMeetupById(meetupId);
      } catch(e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },

  created() {
    this.loadMeetupData();
  },

  template: `
    <div class="page-meetup">
    
      <MeetupView v-if="meetup" :meetup="meetup"/>
  
      <ui-container v-if="loading">
        <ui-alert>Загрузка...</ui-alert>
      </ui-container>
  
      <ui-container v-if="error">
        <ui-alert>{{ error }}</ui-alert>
      </ui-container>
    </div>`,
});

export default PageMeetup;

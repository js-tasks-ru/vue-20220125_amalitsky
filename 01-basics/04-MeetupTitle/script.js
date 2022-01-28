import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

const API_URL = 'https://course-vue.javascript.ru/api';

function fetchMeetupById(meetupId) {
  return fetch(`${API_URL}/meetups/${meetupId}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then((error) => {
        throw error;
      });
    }
  });
}

const template = `
  <div>
    <label v-for="n of 5" :key="n">
      <input
        type="radio"
        :value="n"
        v-model="meetupId"
        :disabled="loading"
      /> {{ n }}
    </label>
    <hr />

    <h3 v-show="!loading">{{ meetupHeader }}</h3>
    <h4 v-show="loading">loading...</h4>
  </div>
`;

const app = createApp({});

const Meetups = defineComponent({
  data() {
    return {
      meetupId: 1,
      loading: false,
      meetupData: null,
    };
  },
  methods: {
    async loadMeetup(id) {
      // we need to introduce `requestId` here to avoid
      // race condition and respect the most recent call
      // seems like an overkill for now
      if (this.loading) {
       return Promise.reject('Currently loading');
      }

      this.loading = true;
      this.meetupData = null;

      const meetupData = await fetchMeetupById(id);

      this.loading = false;
      this.meetupData = meetupData;
    },
  },
  computed: {
    meetupHeader() {
      return this.meetupData?.title || '';
    },
  },
  created() {
    this.loadMeetup(this.meetupId);
  },
  watch: {
    meetupId(newId, oldId) {
      if (newId === oldId) {
        return;
      }

      this.loadMeetup(newId);
    },
  },
  template,
});

app.component('meetups', Meetups);

app.mount('#app');

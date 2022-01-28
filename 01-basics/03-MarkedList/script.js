import { createApp, defineComponent } from './vendor/vue.esm-browser.js';

// From https://jsonplaceholder.typicode.com/comments
const emails = [
  'Eliseo@gardner.biz',
  'Jayne_Kuhic@sydney.com',
  'Nikita@garfield.biz',
  'Lew@alysha.tv',
  'Hayden@althea.biz',
  'Presley.Mueller@myrl.com',
  'Dallas@ole.me',
  'Mallory_Kunze@marie.org',
  'Meghan_Littel@rene.us',
  'Carmen_Keeling@caroline.name',
  'Veronica_Goodwin@timmothy.net',
  'Oswald.Vandervort@leanne.org',
  'Kariane@jadyn.tv',
  'Nathan@solon.io',
  'Maynard.Hodkiewicz@roberta.com',
  'Christine@ayana.info',
  'Preston_Hudson@blaise.tv',
  'Vincenza_Klocko@albertha.name',
  'Madelynn.Gorczany@darion.biz',
  'Mariana_Orn@preston.org',
  'Noemie@marques.me',
  'Khalil@emile.co.uk',
  'Sophia@arianna.co.uk',
  'Jeffery@juwan.us',
  'Isaias_Kuhic@jarrett.net',
];

const app = createApp({});

const template = `
  <div class="form-group">
    <input type="search" v-model="search"/>
  </div>
  <ul>
    <li v-for="[email, isMatch] of emailMatchMap" :key="email" :class="{ marked: isMatch }">{{ email }}</li>
  </ul>
`;

const List = defineComponent({
  data() {
    return {
      emails,
      search: '',
    };
  },
  computed: {
    emailMatchMap() {
      const { emails, search } = this;

      const lowerCaseSearch = search.toLowerCase();

      const matches = emails.map((email) => {
        const hasMatch = search ? email.toLowerCase().includes(lowerCaseSearch) : false;

        return [email, hasMatch];
      });

      return new Map(matches); // email is a key and `true` as value when there is a match
    },
  },
  template,
});

app.component('list', List);

app.mount('#app');

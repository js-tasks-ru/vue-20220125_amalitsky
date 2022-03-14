<template>
  <fieldset class="agenda-item-form">
    <button
      type="button"
      class="agenda-item-form__remove-button"
      @click="remove()"
    >
      <ui-icon icon="trash" />
    </button>

    <ui-form-group>
      <ui-dropdown
        title="Тип"
        name="type"
        :options="$options.agendaItemTypeOptions"
        @change="onEventTypeChange()"
        v-model="localAgendaItem.type"
      />
    </ui-form-group>

    <div class="agenda-item-form__row">
      <div class="agenda-item-form__col">
        <ui-form-group
          label="Начало"
        >
          <ui-input
            type="time"
            placeholder="00:00"
            name="startsAt"
            ref="startsAt"
            v-model.lazy="localAgendaItem.startsAt"
          />
        </ui-form-group>
      </div>
      <div class="agenda-item-form__col">
        <ui-form-group
          label="Окончание"
        >
          <ui-input
            type="time"
            placeholder="00:00"
            ref="endsAt"
            name="endsAt"
            v-model.lazy="localAgendaItem.endsAt"
          />
        </ui-form-group>
      </div>
    </div>

    <ui-form-group
      :label="titleFieldLabel"
    >
      <ui-input
        name="title"
        v-model="localAgendaItem.title"
      />
    </ui-form-group>

    <ui-form-group
      label="Докладчик"
      v-if="withLanguageAndSpeaker"
    >
      <ui-input
        name="speaker"
        v-model="localAgendaItem.speaker"
      />
    </ui-form-group>

    <ui-form-group
      v-if="withDescription"
      label="Описание"
    >
      <ui-input
        multiline
        name="description"
        v-model="localAgendaItem.description"
      />
    </ui-form-group>

    <ui-form-group
      v-if="withLanguageAndSpeaker"
      label="Язык"
    >
      <ui-dropdown
        title="Язык"
        :options="$options.talkLanguageOptions"
        name="language"
        v-model="localAgendaItem.language"
      />
    </ui-form-group>
  </fieldset>
</template>

<script>
import UiIcon from './UiIcon';
import UiFormGroup from './UiFormGroup';
import UiInput from './UiInput';
import UiDropdown from './UiDropdown';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

const agendaItemTypeIcons = {
  registration: 'key',
  opening: 'cal-sm',
  talk: 'tv',
  break: 'clock',
  coffee: 'coffee',
  closing: 'key',
  afterparty: 'cal-sm',
  other: 'cal-sm',
};

const agendaItemDefaultTitles = {
  registration: 'Регистрация',
  opening: 'Открытие',
  break: 'Перерыв',
  coffee: 'Coffee Break',
  closing: 'Закрытие',
  afterparty: 'Afterparty',
  talk: 'Доклад',
  other: 'Другое',
};

const agendaItemTypeOptions = Object.entries(agendaItemDefaultTitles).map(([type, title]) => ({
  value: type,
  text: title,
  icon: agendaItemTypeIcons[type],
}));

const talkLanguageOptions = [
  { value: null, text: 'Не указано' },
  { value: 'RU', text: 'RU' },
  { value: 'EN', text: 'EN' },
];

const titleFieldLabels = {
  talk: 'Тема',
  other: 'Заголовок',
  default: 'Нестандартный текст (необязательно)',
};

function timeStringToMs(timeStr) {
  const [hours, minutes] = timeStr.split(':');

  return (hours * 60 + Number(minutes)) * 60 * 1000;
}

export default {
  name: 'MeetupAgendaItemForm',

  agendaItemTypeOptions,
  talkLanguageOptions,

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  emits: [
    'update:agendaItem',
    'remove',
  ],

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    const { agendaItem } = this;

    return {
      localAgendaItem: {
        ...agendaItem,
      },
    };
  },

  computed: {
    titleFieldLabel() {
      const { type } = this.localAgendaItem;

      if (type in titleFieldLabels) {
        return titleFieldLabels[type];
      }

      return titleFieldLabels.default;
    },
    withDescription() {
      const { type } = this.localAgendaItem;

      return type === 'talk' || type === 'other';
    },
    withLanguageAndSpeaker() {
      const { type } = this.localAgendaItem;

      return type === 'talk';
    },
  },

  watch: {
    localAgendaItem: {
      handler(agendaItem) {
        this.$emit('update:agendaItem', agendaItem);
      },
      deep: true,
    },
    'localAgendaItem.startsAt'(startsAt, previousStartsAt) {
      const { endsAt } = this.localAgendaItem;

      const previousStartsAtMs = timeStringToMs(previousStartsAt);
      const startsAtMs = timeStringToMs(startsAt);
      const previousEndsAtMs = timeStringToMs(endsAt);

      // can't calculate the expected duration
      // hence can't update endsAt either
      if (!startsAt || !endsAt || (!previousStartsAtMs && previousStartsAtMs !== 0)) {
        return;
      }

      const duration = previousEndsAtMs - previousStartsAtMs;

      const endsAtMs = startsAtMs + duration;

      const endDate = dayjs(endsAtMs);

      const endsAtStr = endDate.utc().format('HH:mm');

      this.localAgendaItem.endsAt = endsAtStr;
    },
  },

  methods: {
    remove() {
      this.$emit('remove');
    },
    onEventTypeChange() {
      const { localAgendaItem } = this;

      // these are avail for talk type only, hence safe to wipe them out
      // on any type change
      delete localAgendaItem.language;
      delete localAgendaItem.speaker;

      if (!this.withDescription) {
        delete localAgendaItem.description;
      }
    },
  },

  mounted() {
    const {
      startsAt: startsAtInput,
    } = this.$refs;

    this.previousStartsAtMs = startsAtInput.getValueAsNumber();
  },
};
</script>

<style scoped>
.agenda-item-form {
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 20px 10% 0 16px;
}

.agenda-item-form__remove-button {
  position: absolute;
  top: 4px;
  right: 0;
  box-shadow: none;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 4px;
  cursor: pointer;
  transition: 0.2s opacity;
}

.agenda-item-form__remove-button:hover {
  opacity: 0.6;
}

.agenda-item-form__row {
  display: flex;
  flex-direction: column;
}

.agenda-item-form__col + .agenda-item-form__col {
  margin-top: 16px;
}

.agenda-item-form__col:first-child {
  margin-left: 0;
}

@media all and (min-width: 992px) {
  .agenda-item-form {
    padding: 28px 25% 4px 24px;
  }

  .agenda-item-form__remove-button {
    top: 20px;
    right: 20px;
  }

  .agenda-item-form__row {
    flex-direction: row;
    justify-content: space-between;
    margin: 0 -12px;
  }

  .agenda-item-form__col {
    flex: 1 1 auto;
    padding: 0 12px;
  }

  .agenda-item-form__col + .agenda-item-form__col {
    margin-top: 0;
  }

  .agenda-item-form__col:first-child {
    margin-left: 0;
  }
}
</style>

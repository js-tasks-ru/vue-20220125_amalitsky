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
        :options="$options.agendaItemTypeOptions"
        v-model="localAgendaItem.type"
        name="type"
      />
    </ui-form-group>

    <div class="agenda-item-form__row">
      <div class="agenda-item-form__col">
        <ui-form-group label="Начало">
          <ui-input
            type="time"
            placeholder="00:00"
            name="startsAt"
            ref="startsAt"
            v-model.lazy="localAgendaItem.startsAt"
            v-on:update:modelValue="onStartTimeChange()"
          />
        </ui-form-group>
      </div>
      <div class="agenda-item-form__col">
        <ui-form-group label="Окончание">
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

    <template v-for="(field, fieldName) in $options.agendaItemFormSchemas[localAgendaItem.type]">
      <ui-form-group
        :label="field.label"
      >
      <component
        v-bind="field.props"
        :is="field.component"
        v-model="localAgendaItem[fieldName]"
      />
      </ui-form-group>
    </template>

<!--    <ui-form-group label="Заголовок">
      <ui-input name="title" />
    </ui-form-group>
    <ui-form-group label="Описание">
      <ui-input multiline name="description" />
    </ui-form-group>-->
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

/**
 * @typedef FormItemSchema
 * @property {string} label
 * @property {string|object} component
 * @property {object} props
 */
/** @typedef {string} AgendaItemField */
/** @typedef {string} AgendaItemType */
/** @typedef {Object.<AgendaItemType, FormItemSchema>} FormSchema */

/** @type FormSchema */
const commonAgendaItemFormSchema = {
  title: {
    label: 'Нестандартный текст (необязательно)',
    component: 'ui-input',
    props: {
      name: 'title',
    },
  },
};

/** @type {Object.<AgendaItemField, FormSchema>} */
const agendaItemFormSchemas = {
  registration: commonAgendaItemFormSchema,
  opening: commonAgendaItemFormSchema,
  talk: {
    title: {
      label: 'Тема',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    speaker: {
      label: 'Докладчик',
      component: 'ui-input',
      props: {
        name: 'speaker',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
    language: {
      label: 'Язык',
      component: 'ui-dropdown',
      props: {
        options: talkLanguageOptions,
        title: 'Язык',
        name: 'language',
      },
    },
  },
  break: commonAgendaItemFormSchema,
  coffee: commonAgendaItemFormSchema,
  closing: commonAgendaItemFormSchema,
  afterparty: commonAgendaItemFormSchema,
  other: {
    title: {
      label: 'Заголовок',
      component: 'ui-input',
      props: {
        name: 'title',
      },
    },
    description: {
      label: 'Описание',
      component: 'ui-input',
      props: {
        multiline: true,
        name: 'description',
      },
    },
  },
};

export default {
  name: 'MeetupAgendaItemForm',

  components: { UiIcon, UiFormGroup, UiInput, UiDropdown },

  agendaItemTypeOptions,
  agendaItemFormSchemas,

  emits: ['remove', 'update:agendaItem'],

  props: {
    agendaItem: {
      type: Object,
      required: true,
    },
  },

  watch: {
    localAgendaItem: {
      handler(agendaItem) {
        this.$emit('update:agendaItem', agendaItem);
      },
      deep: true,
    },
  },

  data() {
    const { agendaItem } = this;

    return {
      localAgendaItem: {
        ...agendaItem,
      },
      previousStartsAtMs: null,
    };
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

      if (!this.withDescription()) {
        delete localAgendaItem.description;
      }
    },
    withDescription() {
      const { type } = this.localAgendaItem;

      return type === 'talk' || type === 'other';
    },
    withLanguageAndSpeaker() {
      const { type } = this.localAgendaItem;

      return type === 'talk';
    },
    onStartTimeChange() {
      const {
        localAgendaItem,
        previousStartsAtMs,
      } = this;

      const { startsAt, endsAt } = localAgendaItem;

      const {
        startsAt: startsAtInput,
        endsAt: endsAtInput,
      } = this.$refs;

      const startsAtMs = startsAtInput.getValueAsNumber();
      const previousEndsAtMs = endsAtInput.getValueAsNumber();

      this.previousStartsAtMs = startsAtMs;

      // can't calculate the expected duration
      // hence can't update endsAt either
      if (!endsAt || !startsAt || (!previousStartsAtMs && previousStartsAtMs !== 0)) {
        return;
      }

      const duration = previousEndsAtMs - previousStartsAtMs;

      const endsAtMs = startsAtMs + duration;

      const endDate = dayjs(endsAtMs);

      const endsAtStr = endDate.utc().format('HH:mm');

      localAgendaItem.endsAt = endsAtStr;
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

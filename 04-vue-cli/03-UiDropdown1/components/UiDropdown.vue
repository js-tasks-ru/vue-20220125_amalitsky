<template>
  <div
    class="dropdown"
    :class="renderOptions ? 'dropdown_opened' : null"
  >
    <button
      type="button"
      class="dropdown__toggle"
      :class="haveOptionWithIcon ? 'dropdown__toggle_icon' : null"
      @click="renderOptions ? hideOptions() : showOptions()"
    >
      <ui-icon
        v-if="icon"
        :icon="icon"
        class="dropdown__icon"
      />
      <span>{{ label }}</span>
    </button>

    <div
      v-show="renderOptions"
      class="dropdown__menu"
      role="listbox"
    >
      <ui-dropdown-option
        v-for="option in options"
        :key="option.value"
        :option="option"
        :class="haveOptionWithIcon ? 'dropdown__item_icon': null"
        @optionSelection="selectOption(option)"
      />
    </div>

    <select
      v-model="nativeSelectValue"
      class="dropdown__native-select"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >{{ option.text }}</option>
    </select>
  </div>
</template>

<script>
import UiIcon from './UiIcon';
import UiDropdownOption from './UiDropdownOption';

const EVENT = 'update:modelValue';

export default {
  name: 'UiDropdown',

  components: {
    UiDropdownOption,
    UiIcon,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    modelValue: String,
    options: {
      type: Array,
      required: true,
    },
  },

  emits: [
    EVENT,
  ],

  data() {
    return {
      renderOptions: false,
    };
  },

  computed: {
    optionsMap() {
      const { options } = this;

      return new Map(
        options.map(option => [option.value, option]),
      );
    },
    nativeSelectValue: {
      get() {
        return this.modelValue || '';
      },
      set(value) {
        this.$emit(EVENT, value);
        this.hideOptions();
      }
    },
    label() {
      const { title, selectedOption } = this;

      if (selectedOption) {
        return selectedOption.text;
      }

      return title;
    },
    icon() {
      const { selectedOption } = this;

      if (!selectedOption) {
        return;
      }

      return selectedOption.icon;
    },
    selectedOption() {
      const { modelValue, optionsMap } = this;

      if (!modelValue) {
        return null;
      }

      const option = optionsMap.get(modelValue);

      return option || null;
    },
    haveOptionWithIcon() {
      return this.options.some(option => option.icon);
    },
  },

  methods: {
    selectOption(option) {
      this.$emit(EVENT, option.value);
      this.hideOptions();
    },
    showOptions() {
      this.renderOptions = true;
    },
    hideOptions() {
      this.renderOptions = false;
    }
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown__toggle {
  display: inline-block;
  background-color: var(--white);
  background-position: calc(100% - 10px) calc(100% - 10px);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  position: relative;
  padding: 10px 56px 10px 24px;
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  color: initial;
  text-align: center;
  transition-duration: 0.2s;
  transition-property: background-color, fill, color;
  outline: none;
  box-shadow: none;
  cursor: pointer;
  text-decoration: none;
}

.dropdown__toggle:after {
  content: '';
  position: absolute;
  top: 15px;
  right: 16px;
  transform: none;
  background: url('~@/assets/icons/icon-chevron-down.svg') no-repeat;
  background-size: cover;
  display: block;
  width: 24px;
  height: 24px;
  transition: 0.2s transform;
}

.dropdown__toggle.dropdown__toggle_icon {
  padding-left: 56px;
}

.dropdown_opened .dropdown__toggle {
  border-color: var(--blue);
  border-bottom-color: transparent;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.dropdown_opened .dropdown__toggle:after {
  transform: rotate(180deg);
}

.dropdown__menu {
  margin: 0;
  width: 100%;
  padding: 0;
  border-radius: 0 0 8px 8px;
  left: 0;
  z-index: 95;
  background-clip: padding-box;
  display: none;
  flex-direction: column;
  border: 2px solid var(--blue);
  border-top: none;
  overflow: hidden;
}

.dropdown_opened .dropdown__menu {
  display: flex;
  position: absolute;
  transform: translate3d(0px, 52px, 0px);
  top: -1px;
  left: 0;
  will-change: transform;
  right: auto;
  bottom: auto;
}

.dropdown__item.dropdown__item_icon {
  padding-left: 56px;
  position: relative;
}

.dropdown__item.dropdown__item_icon :deep(.dropdown__icon),
.dropdown__toggle_icon .dropdown__icon {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translate(0, -50%);
}

.dropdown__native-select {
  position: absolute;
  left: -5000em;
  height: 0;
  overflow: hidden;
}
</style>

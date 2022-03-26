import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';

/**
 * @template T
 * @param {Ref<T>} source - Исходный ref
 * @param {number} wait - Ожидание в миллисекундах для debounce
 * @returns {Ref<any>} - Новый ref, обновляющийся с debounce при обновлении исходного ref-а
 */
export function debouncedRef(source, wait) {
  const debounced = ref(undefined); // ...

  const callback = (updatedValue) => {
    console.log(updatedValue);

    debounced.value = updatedValue;
  };

  watch(source, debounce(callback, wait));

  callback(source.value);

  return debounced;
}

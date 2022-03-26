import { computed, isRef } from 'vue';

/**
 * @template T
 * @param {function(...[*]): T} func - Исходная функция вычисления
 * @returns {function(...[*]): ComputedRef<T>} - Функция вычисления от ref-ов, возвращающая вычисляемое значение computed
 */
export function reactify(func) {

  return (...args) =>
    computed(() => {
      const values = args.map(arg => isRef(arg) ? arg.value : arg);

      return func(...values);
    });
}

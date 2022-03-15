<template>
  <div v-if="!sensors || sensors.value">Loading...</div>
  <template v-else>
    <sensors-data-row
      v-for="sensor in sensors"
      :key="sensor.id"
      :sensor="sensor"
    />
  </template>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { SensorsDataController } from '../services/SensorsDataController';
import { SensorsDataStreamingService } from '../services/SensorsDataStreamingService';
import SensorsDataRow from './SensorsDataRow';
import { cloneDeep } from 'lodash-es';

export default {
  name: 'SensorsDataView',

  components: { SensorsDataRow },

  setup() {
    const sensors = ref(null);

    let timeoutId;
    let sensorsDataController;

    function onDataUpdate(data) {
      // is deepClone really necessary?
      sensors.value = cloneDeep(data);
    }

    onMounted(() => {
      const service = new SensorsDataStreamingService();

      sensorsDataController = new SensorsDataController(service);
      sensorsDataController.addDataCallback(onDataUpdate);

      // Раз в секунду запрашиваем и выводим новые данные сенсоров
      timeoutId = setInterval(() => {
        sensorsDataController.getData();
      }, 1000);
    });

    onBeforeUnmount(() => {
      sensorsDataController.removeDataCallback(onDataUpdate);
      sensorsDataController.close();

      clearInterval(timeoutId);
    });

    return {
      sensors,
    };
  },
};
</script>

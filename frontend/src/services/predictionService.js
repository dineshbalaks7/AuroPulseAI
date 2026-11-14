import apiClient from './api';

// Allowed fields for FD001 (19 features: time_in_cycles, 3 op settings, 15 sensors)
const FD001_FIELDS = [
  'time_in_cycles',
  'op_setting_1',
  'op_setting_2',
  'op_setting_3',
  'sensor_2',
  'sensor_3',
  'sensor_4',
  'sensor_6',
  'sensor_7',
  'sensor_8',
  'sensor_9',
  'sensor_11',
  'sensor_12',
  'sensor_13',
  'sensor_14',
  'sensor_15',
  'sensor_17',
  'sensor_20',
  'sensor_21',
];

// Allowed fields for FD002 (3 op settings, 21 sensors; time_in_cycles is forbidden by Pydantic extra="forbid")
const FD002_FIELDS = [
  'op_setting_1',
  'op_setting_2',
  'op_setting_3',
  ...Array.from({ length: 21 }, (_, i) => `sensor_${i + 1}`),
];

export const predictionService = {
  /**
   * Submit prediction request for FD001
   */
  async predictFD001(sensorData) {
    const payload = {};
    for (const key of FD001_FIELDS) {
      if (key in sensorData && sensorData[key] !== '' && !isNaN(Number(sensorData[key]))) {
        payload[key] = Number(sensorData[key]);
      } else {
        throw new Error(`Missing or invalid required field for FD001: ${key}`);
      }
    }
    const response = await apiClient.post('/predict/fd001', payload);
    return response.data;
  },

  /**
   * Submit prediction request for FD002
   */
  async predictFD002(sensorData) {
    const payload = {};
    for (const key of FD002_FIELDS) {
      if (key in sensorData && sensorData[key] !== '' && !isNaN(Number(sensorData[key]))) {
        payload[key] = Number(sensorData[key]);
      } else {
        throw new Error(`Missing or invalid required field for FD002: ${key}`);
      }
    }
    const response = await apiClient.post('/predict/fd002', payload);
    return response.data;
  },

  /**
   * Submit prediction for given dataset
   */
  async predict(dataset, sensorData) {
    const ds = dataset.toUpperCase();
    if (ds === 'FD001') {
      return await this.predictFD001(sensorData);
    } else if (ds === 'FD002') {
      return await this.predictFD002(sensorData);
    } else {
      throw new Error(`Unsupported dataset: ${dataset}. Expected FD001 or FD002.`);
    }
  },
};

export default predictionService;

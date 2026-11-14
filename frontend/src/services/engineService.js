import apiClient from './api';

export const engineService = {
  /**
   * Get available datasets and their metadata
   */
  async getDatasets() {
    const response = await apiClient.get('/datasets');
    return response.data;
  },

  /**
   * Get aggregated overview metrics and chart distributions
   */
  async getOverview(dataset, criticalThreshold = 30, warningThreshold = 75) {
    const response = await apiClient.get(`/overview/${dataset}`, {
      params: { critical_threshold: criticalThreshold, warning_threshold: warningThreshold },
    });
    return response.data;
  },

  /**
   * Get list of engines in dataset with current status
   */
  async getEngines(dataset, status = null, criticalThreshold = 30, warningThreshold = 75) {
    const params = {
      critical_threshold: criticalThreshold,
      warning_threshold: warningThreshold,
    };
    if (status) params.status = status;
    const response = await apiClient.get(`/engines/${dataset}`, { params });
    return response.data;
  },

  /**
   * Get engine trajectory and sensor telemetry
   */
  async getEngineSensors(dataset, engineId) {
    const response = await apiClient.get(`/sensors/${dataset}/${engineId}`);
    return response.data;
  },

  /**
   * Get specific cycle record for an engine
   */
  async getEngineCycle(dataset, engineId, cycle) {
    const response = await apiClient.get(`/sensors/${dataset}/${engineId}/cycle/${cycle}`);
    return response.data;
  },

  /**
   * Get dataset-level sensor analytics, correlations and distributions
   */
  async getAnalytics(dataset) {
    const response = await apiClient.get(`/analytics/${dataset}`);
    return response.data;
  },

  /**
   * Get maintenance alerts for dataset
   */
  async getAlerts(dataset, status = null, priority = null, criticalThreshold = 30, warningThreshold = 75) {
    const params = {
      critical_threshold: criticalThreshold,
      warning_threshold: warningThreshold,
    };
    if (status) params.status = status;
    if (priority) params.priority = priority;
    const response = await apiClient.get(`/alerts/${dataset}`, { params });
    return response.data;
  },

  /**
   * Get verified model metrics and performance comparisons
   */
  async getModelMetrics(dataset) {
    const response = await apiClient.get(`/metrics/${dataset}`);
    return response.data;
  },

  /**
   * Get sensor names, descriptions, and engineering units
   */
  async getSensorMetadata() {
    const response = await apiClient.get('/sensor-metadata');
    return response.data;
  },

  /**
   * Get catalog of EDA and model prediction figures
   */
  async getReportFigures(dataset = null) {
    const params = dataset ? { dataset } : {};
    const response = await apiClient.get('/reports/figures', { params });
    return response.data;
  },
};

export default engineService;

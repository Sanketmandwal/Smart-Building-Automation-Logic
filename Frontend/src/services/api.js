const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  /**
   * Calculate device settings based on automation mode and conditions
   */
  async calculateDeviceSettings(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/automation/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          automationMode: params.automationMode,
          occupancy: params.occupancy || 0,
          temperature: params.temperature || 25,
          timeOfDay: params.timeOfDay || 'day',
          sunlightIntensity: params.sunlightIntensity || 50,
          humidity: params.humidity || 60,
          roomType: params.roomType || 'office'  // NEW: Room type
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calculating device settings:', error);
      
      // Fallback to default settings if API fails
      return {
        success: false,
        devices: {
          light: { isOn: false, intensity: 0, powerConsumption: 0 },
          fan: { isOn: false, speed: 0, powerConsumption: 0 },
          ac: { isOn: false, mode: 'off', temperature: 24, speed: 0, powerConsumption: 0 }
        },
        error: error.message
      };
    }
  }

  /**
   * Get building analytics (future endpoint)
   */
  async getBuildingAnalytics(buildingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/building/${buildingId}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      console.error('Error fetching building analytics:', error);
      return null;
    }
  }

  /**
   * Get AI insights (future endpoint)
   */
  async getAIInsights(campusData) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campusData)
      });
      if (!response.ok) throw new Error('Failed to fetch AI insights');
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return { insights: [] };
    }
  }
}

export default new ApiService();

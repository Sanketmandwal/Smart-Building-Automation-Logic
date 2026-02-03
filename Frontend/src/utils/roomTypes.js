export const ROOM_TYPE_CONFIGS = {
  conference: {
    automationRules: {
      emptyRoomTimeout: 300, // Turn off after 5 min if empty
      preHeatCool: 600, // Start 10 min before scheduled meeting
      lightingPreference: 'bright',
      acPriority: 'comfort'
    },
    powerProfile: {
      baseLoad: 0,
      occupancyMultiplier: 1.2,
      peakHours: [10, 11, 14, 15, 16]
    }
  },
  
  lab: {
    automationRules: {
      emptyRoomTimeout: 600, // 10 min (equipment may be running)
      preHeatCool: 900,
      lightingPreference: 'very-bright',
      acPriority: 'equipment-cooling'
    },
    powerProfile: {
      baseLoad: 1200, // Computers always on
      occupancyMultiplier: 1.5,
      peakHours: [9, 10, 11, 14, 15, 16, 17]
    }
  },
  
  server: {
    automationRules: {
      emptyRoomTimeout: 0, // Never turn off
      preHeatCool: 0,
      lightingPreference: 'minimal',
      acPriority: 'critical',
      alwaysOn: true
    },
    powerProfile: {
      baseLoad: 3000, // Servers 24/7
      occupancyMultiplier: 0, // Occupancy doesn't matter
      peakHours: [] // Always peak
    },
    alerts: {
      tempThreshold: 25, // Alert if > 25°C
      humidityThreshold: 60
    }
  },
  
  cafeteria: {
    automationRules: {
      emptyRoomTimeout: 180, // 3 min
      preHeatCool: 1800, // 30 min before meal times
      lightingPreference: 'warm',
      acPriority: 'comfort'
    },
    powerProfile: {
      baseLoad: 200, // Refrigerators
      occupancyMultiplier: 2.0, // High impact
      peakHours: [8, 13, 19] // Meal times
    }
  },
  
  office: {
    automationRules: {
      emptyRoomTimeout: 600,
      preHeatCool: 600,
      lightingPreference: 'moderate',
      acPriority: 'balanced'
    },
    powerProfile: {
      baseLoad: 150, // Computers, monitors
      occupancyMultiplier: 1.0,
      peakHours: [9, 10, 11, 14, 15, 16, 17]
    }
  },
  
  library: {
    automationRules: {
      emptyRoomTimeout: 900, // 15 min
      preHeatCool: 1200,
      lightingPreference: 'moderate',
      acPriority: 'quiet',
      noiseReduction: true
    },
    powerProfile: {
      baseLoad: 50,
      occupancyMultiplier: 0.8,
      peakHours: [10, 11, 14, 15, 16, 18, 19]
    }
  },
  
  reception: {
    automationRules: {
      emptyRoomTimeout: 0, // Never empty during hours
      preHeatCool: 1800,
      lightingPreference: 'bright',
      acPriority: 'comfort',
      alwaysStaffed: true
    },
    powerProfile: {
      baseLoad: 100,
      occupancyMultiplier: 0.5,
      peakHours: [9, 10, 11, 14, 15, 16]
    }
  },
  
  storage: {
    automationRules: {
      emptyRoomTimeout: 60, // 1 min
      preHeatCool: 0,
      lightingPreference: 'dim',
      acPriority: 'none',
      minimalAutomation: true
    },
    powerProfile: {
      baseLoad: 0,
      occupancyMultiplier: 0.3,
      peakHours: []
    }
  }
};

export const getRoomTypeConfig = (roomType) => {
  return ROOM_TYPE_CONFIGS[roomType] || ROOM_TYPE_CONFIGS.office;
};

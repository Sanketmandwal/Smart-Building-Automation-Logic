/**
 * CONTEXT-AWARE AI LOGIC
 * This uses real pattern analysis and predictive algorithms
 */

// In-memory pattern storage (in production, use database)
const occupancyPatterns = {};
const temperaturePatterns = {};
const energyHistory = {};

/**
 * Learn from occupancy patterns
 */
function learnOccupancyPattern(roomType, timeOfDay, occupancy) {
  const key = `${roomType}-${timeOfDay}`;
  if (!occupancyPatterns[key]) {
    occupancyPatterns[key] = [];
  }
  occupancyPatterns[key].push(occupancy);
  
  // Keep last 20 readings
  if (occupancyPatterns[key].length > 20) {
    occupancyPatterns[key].shift();
  }
}

/**
 * Predict next hour occupancy using moving average
 */
function predictOccupancy(roomType, timeOfDay) {
  const key = `${roomType}-${timeOfDay}`;
  const history = occupancyPatterns[key];
  
  if (!history || history.length < 3) {
    return null; // Not enough data
  }
  
  // Weighted moving average (recent data has more weight)
  let sum = 0;
  let weightSum = 0;
  
  history.forEach((occupancy, index) => {
    const weight = index + 1; // Recent entries have higher weight
    sum += occupancy * weight;
    weightSum += weight;
  });
  
  return Math.round(sum / weightSum);
}

/**
 * Analyze temperature trend
 */
function analyzeTemperatureTrend(roomId, currentTemp) {
  if (!temperaturePatterns[roomId]) {
    temperaturePatterns[roomId] = [];
  }
  
  temperaturePatterns[roomId].push(currentTemp);
  
  if (temperaturePatterns[roomId].length > 10) {
    temperaturePatterns[roomId].shift();
  }
  
  // Calculate trend (rising/falling/stable)
  if (temperaturePatterns[roomId].length < 3) {
    return 'stable';
  }
  
  const recent = temperaturePatterns[roomId].slice(-3);
  const increasing = recent[2] > recent[1] && recent[1] > recent[0];
  const decreasing = recent[2] < recent[1] && recent[1] < recent[0];
  
  if (increasing) return 'rising';
  if (decreasing) return 'falling';
  return 'stable';
}

/**
 * MAIN AI LOGIC
 */
export const contextAwareAutomation = ({
  occupancy = 0,
  temperature = 25,
  timeOfDay = 'day',
  sunlightIntensity = 50,
  humidity = 60,
  roomType = 'office',
  roomId = 'unknown'
}) => {
  // Learn from current data
  learnOccupancyPattern(roomType, timeOfDay, occupancy);
  
  const devices = {
    light: { isOn: false, intensity: 0, powerConsumption: 0 },
    fan: { isOn: false, speed: 0, powerConsumption: 0 },
    ac: { isOn: false, mode: 'off', temperature: 24, speed: 0, powerConsumption: 0 }
  };

  // AI INSIGHT: Predict future occupancy
  const predictedOccupancy = predictOccupancy(roomType, timeOfDay);
  
  // AI INSIGHT: Analyze temperature trend
  const tempTrend = analyzeTemperatureTrend(roomId, temperature);

  // SERVER ROOM: Critical 24/7
  if (roomType === 'server') {
    devices.light.isOn = occupancy > 0;
    devices.light.intensity = occupancy > 0 ? 60 : 0;
    devices.light.powerConsumption = occupancy > 0 ? 36 : 0;

    devices.ac.isOn = true;
    devices.ac.mode = 'cooling';
    devices.ac.temperature = 18;
    
    // AI: Predictive cooling based on trend
    if (tempTrend === 'rising' || temperature > 21) {
      devices.ac.speed = 3;
      devices.ac.powerConsumption = 2500;
    } else if (temperature > 19) {
      devices.ac.speed = 2;
      devices.ac.powerConsumption = 2000;
    } else {
      devices.ac.speed = 1;
      devices.ac.powerConsumption = 1500;
    }

    devices.fan.isOn = true;
    devices.fan.speed = 3;
    devices.fan.powerConsumption = 100;

    return devices;
  }

  // AI: Predictive pre-cooling for expected occupancy
  const shouldPreCool = occupancy === 0 && predictedOccupancy > 0 && temperature > 26;
  
  if (shouldPreCool) {
    // Start light cooling before people arrive
    devices.ac.isOn = true;
    devices.ac.mode = 'cooling';
    devices.ac.temperature = 24;
    devices.ac.speed = 1;
    devices.ac.powerConsumption = 400;
    
    console.log(`[AI] Pre-cooling ${roomType} - Predicted occupancy: ${predictedOccupancy}`);
  }

  // Empty room (no pre-cooling needed)
  if (occupancy === 0 && !shouldPreCool) {
    return devices;
  }

  // === AI-ENHANCED LIGHTING ===
  let baseLightIntensity = 0;
  
  if (timeOfDay === 'day') {
    if (sunlightIntensity >= 70) {
      devices.light.isOn = false;
    } else if (sunlightIntensity >= 40) {
      devices.light.isOn = true;
      // AI: Adjust based on room type and occupancy pattern
      baseLightIntensity = roomType === 'lab' ? 50 : 
                           roomType === 'cafeteria' ? 40 : 20;
    } else {
      devices.light.isOn = true;
      baseLightIntensity = roomType === 'lab' ? 70 : 
                           roomType === 'cafeteria' ? 60 : 40;
    }
  } else {
    devices.light.isOn = true;
    baseLightIntensity = roomType === 'lab' ? 80 : 
                         roomType === 'cafeteria' ? 75 : 
                         roomType === 'library' ? 65 : 60;
  }

  if (devices.light.isOn) {
    // AI: Smart intensity based on actual occupancy vs predicted
    const occupancyFactor = predictedOccupancy 
      ? Math.min(occupancy / predictedOccupancy, 1.5) 
      : 1;
    
    devices.light.intensity = Math.min(
      Math.round(baseLightIntensity + (occupancy * 6 * occupancyFactor)), 
      100
    );
    
    const lightWattage = roomType === 'cafeteria' ? 120 :
                         roomType === 'lab' ? 80 :
                         roomType === 'library' ? 100 : 60;
    
    devices.light.powerConsumption = Math.round((devices.light.intensity / 100) * lightWattage);
  }

  // === AI-ENHANCED TEMPERATURE CONTROL ===
  
  // AI: Aggressive cooling if temperature is rising fast
  const aggressiveCooling = tempTrend === 'rising';
  
  // CAFETERIA
  if (roomType === 'cafeteria') {
    if (temperature >= 27 || (aggressiveCooling && temperature >= 26)) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 25;
      devices.ac.speed = aggressiveCooling ? 3 : (occupancy > 20 ? 2 : 1);
      devices.ac.powerConsumption = 1500 + (devices.ac.speed * 300);
      
      devices.fan.isOn = true;
      devices.fan.speed = occupancy > 25 ? 2 : 1;
      devices.fan.powerConsumption = 80 + (devices.fan.speed * 40);
    } else if (temperature >= 25) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 25;
      devices.ac.speed = 1;
      devices.ac.powerConsumption = 1200;
      
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 70;
    }
  }
  
  // LAB
  else if (roomType === 'lab') {
    if (temperature >= 25 || (aggressiveCooling && temperature >= 24)) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 22;
      devices.ac.speed = aggressiveCooling ? 2 : 1;
      devices.ac.powerConsumption = 350 + (devices.ac.speed * 300);
      
      devices.fan.isOn = true;
      devices.fan.speed = Math.min(Math.ceil(occupancy / 10), 2);
      devices.fan.powerConsumption = 30 + (devices.fan.speed * 20);
    } else if (temperature >= 23) {
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 30;
    }
  }
  
  // STANDARD ROOMS
  else {
    if (temperature >= 28 || (aggressiveCooling && temperature >= 27)) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 23;
      devices.ac.speed = aggressiveCooling ? 3 : (occupancy > 2 ? 2 : 1);
      devices.ac.powerConsumption = 350 * devices.ac.speed;
      
      devices.fan.isOn = true;
      devices.fan.speed = occupancy > 2 ? 2 : 1;
      devices.fan.powerConsumption = 30 + (devices.fan.speed * 20);
    } else if (temperature >= 26) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 24;
      devices.ac.speed = occupancy > 2 ? 2 : 1;
      devices.ac.powerConsumption = 350 * devices.ac.speed;
      
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 30;
    } else if (temperature >= 24) {
      if (occupancy >= 3 || aggressiveCooling) {
        devices.ac.isOn = true;
        devices.ac.mode = 'cooling';
        devices.ac.temperature = 24;
        devices.ac.speed = 1;
        devices.ac.powerConsumption = 350;
      } else {
        devices.fan.isOn = true;
        devices.fan.speed = 1;
        devices.fan.powerConsumption = 30;
      }
    } else if (temperature >= 22) {
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 30;
    } else if (temperature < 20) {
      devices.ac.isOn = true;
      devices.ac.mode = 'heating';
      devices.ac.temperature = 22;
      devices.ac.speed = Math.min(occupancy, 2);
      devices.ac.powerConsumption = 450 + (devices.ac.speed * 150);
    }
  }

  // Library: AI knows to be quiet
  if (roomType === 'library' && devices.fan.isOn) {
    devices.fan.speed = 1; // Always quiet
    devices.fan.powerConsumption = 30;
  }

  // AI: Humidity compensation
  if (humidity > 70 && devices.ac.isOn) {
    devices.ac.speed = Math.min(devices.ac.speed + 1, 3);
    devices.ac.powerConsumption = devices.ac.mode === 'cooling' 
      ? 350 * devices.ac.speed 
      : 450 + (devices.ac.speed * 150);
  }

  return devices;
};

/**
 * Get AI insights for a room
 */
export const getAIInsights = (roomType, roomId) => {
  const insights = [];
  
  // Occupancy prediction insight
  const predicted = predictOccupancy(roomType, 'day');
  if (predicted !== null) {
    insights.push({
      type: 'prediction',
      message: `AI predicts ${predicted} people in next hour`,
      confidence: occupancyPatterns[`${roomType}-day`]?.length >= 10 ? 'high' : 'medium'
    });
  }
  
  // Temperature trend insight
  const trend = temperaturePatterns[roomId];
  if (trend && trend.length >= 3) {
    const recent = trend.slice(-3);
    if (recent[2] > recent[0] + 2) {
      insights.push({
        type: 'warning',
        message: 'Temperature rising rapidly - increasing cooling',
        action: 'auto-adjusted'
      });
    }
  }
  
  return insights;
};

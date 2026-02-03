/**
 * RULE-BASED AUTOMATION LOGIC
 * Simple if-then rules for device control
 */

export const ruleBasedAutomation = ({
  occupancy = 0,
  temperature = 25,
  timeOfDay = 'day',
  sunlightIntensity = 50,
  humidity = 60,
  roomType = 'office'
}) => {
  const devices = {
    light: { isOn: false, intensity: 0, powerConsumption: 0 },
    fan: { isOn: false, speed: 0, powerConsumption: 0 },
    ac: { isOn: false, mode: 'off', temperature: 24, speed: 0, powerConsumption: 0 }
  };

  // ========= SERVER ROOM: ALWAYS ON =========
  if (roomType === 'server') {
    // Light only when someone enters
    if (occupancy > 0) {
      devices.light.isOn = true;
      devices.light.intensity = 80;
      devices.light.powerConsumption = 48;
    }

    // AC always running (critical)
    devices.ac.isOn = true;
    devices.ac.mode = 'cooling';
    devices.ac.temperature = 18;
    devices.ac.speed = 3;
    devices.ac.powerConsumption = 2500;

    // Fan always running
    devices.fan.isOn = true;
    devices.fan.speed = 3;
    devices.fan.powerConsumption = 100;

    return devices;
  }

  // ========= EMPTY ROOM: ALL OFF =========
  if (occupancy === 0) {
    return devices; // All off
  }

  // ========= LIGHTING CONTROL =========
  // Room has people, control lights based on time and sunlight
  
  if (timeOfDay === 'night') {
    // NIGHT: Always turn lights ON
    devices.light.isOn = true;
    devices.light.intensity = 100; // Full brightness at night
    
    const lightWattage = roomType === 'cafeteria' ? 120 :
                         roomType === 'lab' ? 80 :
                         roomType === 'library' ? 100 : 60;
    
    devices.light.powerConsumption = lightWattage;
    
  } else {
    // DAY: Control based on sunlight
    if (sunlightIntensity < 30) {
      // Dark day: Lights ON, full brightness
      devices.light.isOn = true;
      devices.light.intensity = 100;
      
      const lightWattage = roomType === 'cafeteria' ? 120 :
                           roomType === 'lab' ? 80 :
                           roomType === 'library' ? 100 : 60;
      
      devices.light.powerConsumption = lightWattage;
      
    } else if (sunlightIntensity < 60) {
      // Medium sunlight: Lights ON, medium brightness
      devices.light.isOn = true;
      devices.light.intensity = 60;
      
      const lightWattage = roomType === 'cafeteria' ? 120 :
                           roomType === 'lab' ? 80 :
                           roomType === 'library' ? 100 : 60;
      
      devices.light.powerConsumption = Math.round(lightWattage * 0.6);
      
    } else {
      // Bright sunlight: Lights ON but low
      devices.light.isOn = true;
      devices.light.intensity = 30;
      
      const lightWattage = roomType === 'cafeteria' ? 120 :
                           roomType === 'lab' ? 80 :
                           roomType === 'library' ? 100 : 60;
      
      devices.light.powerConsumption = Math.round(lightWattage * 0.3);
    }
  }

  // ========= TEMPERATURE CONTROL =========
  
  // CAFETERIA (high occupancy, high power)
  if (roomType === 'cafeteria') {
    if (temperature >= 28) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 25;
      devices.ac.speed = 3;
      devices.ac.powerConsumption = 2000;
      
      devices.fan.isOn = true;
      devices.fan.speed = 3;
      devices.fan.powerConsumption = 150;
    } else if (temperature >= 26) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 25;
      devices.ac.speed = 2;
      devices.ac.powerConsumption = 1500;
      
      devices.fan.isOn = true;
      devices.fan.speed = 2;
      devices.fan.powerConsumption = 100;
    } else if (temperature >= 24) {
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 75;
    }
  }
  
  // LAB (equipment heat)
  else if (roomType === 'lab') {
    if (temperature >= 26) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 22;
      devices.ac.speed = 3;
      devices.ac.powerConsumption = 1500;
      
      devices.fan.isOn = true;
      devices.fan.speed = 2;
      devices.fan.powerConsumption = 75;
    } else if (temperature >= 24) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 22;
      devices.ac.speed = 2;
      devices.ac.powerConsumption = 1000;
      
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 50;
    } else if (temperature >= 23) {
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 50;
    }
  }
  
  // STANDARD ROOMS (office, conference, library, etc.)
  else {
    if (temperature >= 30) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 24;
      devices.ac.speed = 3;
      devices.ac.powerConsumption = 1500;
      
      devices.fan.isOn = true;
      devices.fan.speed = 3;
      devices.fan.powerConsumption = 75;
    } else if (temperature >= 28) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 24;
      devices.ac.speed = 2;
      devices.ac.powerConsumption = 1000;
      
      devices.fan.isOn = true;
      devices.fan.speed = 2;
      devices.fan.powerConsumption = 50;
    } else if (temperature >= 26) {
      devices.ac.isOn = true;
      devices.ac.mode = 'cooling';
      devices.ac.temperature = 24;
      devices.ac.speed = 1;
      devices.ac.powerConsumption = 700;
      
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 40;
    } else if (temperature >= 24) {
      devices.fan.isOn = true;
      devices.fan.speed = 1;
      devices.fan.powerConsumption = 40;
    } else if (temperature < 20) {
      // Heating mode
      devices.ac.isOn = true;
      devices.ac.mode = 'heating';
      devices.ac.temperature = 22;
      devices.ac.speed = 2;
      devices.ac.powerConsumption = 800;
    }
  }

  // Humidity adjustment
  if (humidity > 75 && devices.ac.isOn) {
    devices.ac.speed = Math.min(devices.ac.speed + 1, 3);
    devices.ac.powerConsumption = devices.ac.mode === 'cooling' 
      ? 500 * devices.ac.speed 
      : 400 * devices.ac.speed;
  }

  return devices;
};

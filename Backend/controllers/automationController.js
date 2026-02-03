import { ruleBasedAutomation } from '../logic/ruleBasedLogic.js';
import { contextAwareAutomation, getAIInsights } from '../logic/contextAwareLogic.js';

export const getDeviceSettings = (req, res) => {
  try {
    const {
      automationMode,
      occupancy,
      temperature,
      timeOfDay,
      sunlightIntensity,
      humidity,
      roomType,
      roomId
    } = req.body;

    // ✅ DEBUG LOG
    console.log('📥 Request:', {
      automationMode,
      occupancy,
      temperature,
      timeOfDay,
      sunlightIntensity,
      roomType,
      roomId
    });

    if (automationMode === undefined) {
      return res.status(400).json({ error: 'Automation mode required' });
    }

    let deviceSettings;
    let aiInsights = [];

    switch (automationMode) {
      case 'none':
        // No automation
        if (roomType === 'server') {
          deviceSettings = {
            light: { isOn: false, intensity: 0, powerConsumption: 0 },
            fan: { isOn: true, speed: 3, powerConsumption: 100 },
            ac: { isOn: true, mode: 'cooling', temperature: 18, speed: 3, powerConsumption: 2500 }
          };
        } else if (roomType === 'cafeteria') {
          deviceSettings = {
            light: { isOn: true, intensity: 100, powerConsumption: 120 },
            fan: { isOn: true, speed: 3, powerConsumption: 150 },
            ac: { isOn: true, mode: 'cooling', temperature: 25, speed: 3, powerConsumption: 2000 }
          };
        } else {
          deviceSettings = {
            light: { isOn: true, intensity: 100, powerConsumption: 60 },
            fan: { isOn: true, speed: 3, powerConsumption: 75 },
            ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
          };
        }
        break;

      case 'rule-based':
        deviceSettings = ruleBasedAutomation({
          occupancy,
          temperature,
          timeOfDay,
          sunlightIntensity,
          humidity,
          roomType
        });
        break;

      case 'context-aware':
        deviceSettings = contextAwareAutomation({
          occupancy,
          temperature,
          timeOfDay,
          sunlightIntensity,
          humidity,
          roomType,
          roomId
        });
        
        aiInsights = getAIInsights(roomType, roomId);
        break;

      default:
        return res.status(400).json({ error: 'Invalid automation mode' });
    }

    const totalPower = 
      (deviceSettings.light.isOn ? deviceSettings.light.powerConsumption : 0) +
      (deviceSettings.fan.isOn ? deviceSettings.fan.powerConsumption : 0) +
      (deviceSettings.ac.isOn ? deviceSettings.ac.powerConsumption : 0);

    // ✅ DEBUG LOG
    console.log('📤 Response:', {
      roomId,
      light: deviceSettings.light,
      totalPower
    });

    res.json({
      success: true,
      automationMode,
      roomType,
      roomId,
      devices: deviceSettings,
      totalPowerConsumption: totalPower,
      aiInsights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

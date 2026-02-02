import { createContext, useContext, useState, useEffect } from 'react';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

export const SimulationProvider = ({ children }) => {
  // Automation Modes
  const [automationMode, setAutomationMode] = useState('none'); // 'none', 'rule-based', 'context-aware'
  
  // Room State
  const [occupancy, setOccupancy] = useState(0); // Number of people in room
  const [peopleOutside, setPeopleOutside] = useState([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' }
  ]);
  const [peopleInside, setPeopleInside] = useState([]);
  
  // Environmental Conditions
  const [timeOfDay, setTimeOfDay] = useState('day'); // 'day' or 'night'
  const [sunlightIntensity, setSunlightIntensity] = useState(80); // 0-100
  const [temperature, setTemperature] = useState(28); // Celsius
  const [humidity, setHumidity] = useState(60); // Percentage
  
  // Device States
  const [devices, setDevices] = useState({
    light: {
      isOn: true,
      intensity: 100, // 0-100
      powerConsumption: 60 // Watts
    },
    fan: {
      isOn: true,
      speed: 3, // 0-3 (off, low, medium, high)
      powerConsumption: 75
    },
    ac: {
      isOn: true,
      mode: 'cooling', // 'cooling', 'heating', 'off'
      temperature: 24,
      speed: 3, // 0-3
      powerConsumption: 1500
    }
  });
  
  // Power Tracking
  const [powerHistory, setPowerHistory] = useState([]);
  const [totalPowerConsumption, setTotalPowerConsumption] = useState(0);
  
  // Simulation Control
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Calculate total power consumption
  useEffect(() => {
    const total = Object.values(devices).reduce((sum, device) => {
      return sum + (device.isOn ? device.powerConsumption : 0);
    }, 0);
    setTotalPowerConsumption(total);
    
    if (isSimulationRunning) {
      setPowerHistory(prev => [...prev, { time: Date.now(), power: total, mode: automationMode }]);
    }
  }, [devices, isSimulationRunning, automationMode]);

  // Person Management
  const movePerson = (personId, toRoom = true) => {
    if (toRoom) {
      const person = peopleOutside.find(p => p.id === personId);
      if (person) {
        setPeopleOutside(prev => prev.filter(p => p.id !== personId));
        setPeopleInside(prev => [...prev, person]);
        setOccupancy(prev => prev + 1);
      }
    } else {
      const person = peopleInside.find(p => p.id === personId);
      if (person) {
        setPeopleInside(prev => prev.filter(p => p.id !== personId));
        setPeopleOutside(prev => [...prev, person]);
        setOccupancy(prev => Math.max(0, prev - 1));
      }
    }
  };

  // Device Control
  const updateDevice = (deviceName, updates) => {
    setDevices(prev => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], ...updates }
    }));
  };

  // Toggle Automation
  const toggleAutomation = () => {
    setIsSimulationRunning(prev => !prev);
  };

  // Reset Simulation
  const resetSimulation = () => {
    setOccupancy(0);
    setPeopleInside([]);
    setPeopleOutside([
      { id: 1, name: 'Person 1' },
      { id: 2, name: 'Person 2' },
      { id: 3, name: 'Person 3' }
    ]);
    setPowerHistory([]);
    setDevices({
      light: { isOn: true, intensity: 100, powerConsumption: 60 },
      fan: { isOn: true, speed: 3, powerConsumption: 75 },
      ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
    });
  };

  const value = {
    // State
    automationMode,
    occupancy,
    peopleOutside,
    peopleInside,
    timeOfDay,
    sunlightIntensity,
    temperature,
    humidity,
    devices,
    powerHistory,
    totalPowerConsumption,
    isSimulationRunning,
    
    // Actions
    setAutomationMode,
    movePerson,
    setTimeOfDay,
    setSunlightIntensity,
    setTemperature,
    setHumidity,
    updateDevice,
    toggleAutomation,
    resetSimulation
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

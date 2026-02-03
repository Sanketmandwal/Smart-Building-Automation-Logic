import { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};

export const SimulationProvider = ({ children }) => {
  const [automationMode, setAutomationMode] = useState('none');
  const [occupancy, setOccupancy] = useState(0);
  const [peopleOutside, setPeopleOutside] = useState([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' },
    { id: 4, name: 'Person 4' },
    { id: 5, name: 'Person 5' },
  ]);

  const [peopleInside, setPeopleInside] = useState([]);
  // Add new state for energy tracking
  const [totalEnergySaved, setTotalEnergySaved] = useState(0); // in Watt-hours
  const [simulationStartTime, setSimulationStartTime] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0); // in seconds
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [sunlightIntensity, setSunlightIntensity] = useState(80);
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(60);

  const [devices, setDevices] = useState({
    light: { isOn: true, intensity: 100, powerConsumption: 60 },
    fan: { isOn: true, speed: 3, powerConsumption: 75 },
    ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
  });

  const [powerHistory, setPowerHistory] = useState([]);
  const [totalPowerConsumption, setTotalPowerConsumption] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      const health = await ApiService.checkHealth();
      setBackendStatus(health.status === 'ok' ? 'connected' : 'disconnected');
    };
    checkBackend();
  }, []);


  // Update when simulation starts/stops
  const toggleAutomation = () => {
    setIsSimulationRunning(prev => {
      const newState = !prev;
      if (newState) {
        // Starting simulation
        setSimulationStartTime(Date.now());
        setTotalEnergySaved(0);
        setSessionDuration(0);
      }
      return newState;
    });
  };

  // Calculate energy saved over time
  useEffect(() => {
    if (!isSimulationRunning || !simulationStartTime) return;

    const interval = setInterval(() => {
      const currentDuration = Math.floor((Date.now() - simulationStartTime) / 1000); // seconds
      setSessionDuration(currentDuration);

      // Calculate energy saved
      // Energy (Wh) = Power (W) × Time (h)
      const baselinePower = 1635; // W
      const currentPower = totalPowerConsumption; // W
      const powerSaved = baselinePower - currentPower; // W
      const timeInHours = currentDuration / 3600; // Convert seconds to hours
      const energySaved = powerSaved * timeInHours; // Wh

      setTotalEnergySaved(energySaved);
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationStartTime, totalPowerConsumption]);

  // Calculate total power consumption
  useEffect(() => {
    const total = Object.values(devices).reduce((sum, device) => {
      return sum + (device.isOn ? device.powerConsumption : 0);
    }, 0);
    setTotalPowerConsumption(total);

    if (isSimulationRunning) {
      setPowerHistory(prev => [...prev.slice(-50), {
        time: Date.now(),
        power: total,
        mode: automationMode
      }]);
    }
  }, [devices, isSimulationRunning, automationMode]);

  // MAIN AUTOMATION LOGIC - Call backend when conditions change
  useEffect(() => {
    if (!isSimulationRunning) return;

    const updateDevices = async () => {
      try {
        const response = await ApiService.calculateDeviceSettings({
          automationMode,
          occupancy,
          temperature,
          timeOfDay,
          sunlightIntensity,
          humidity
        });

        if (response.success) {
          setDevices(response.devices);
        }
      } catch (error) {
        console.error('Failed to update devices:', error);
      }
    };

    updateDevices();
  }, [automationMode, occupancy, temperature, timeOfDay, sunlightIntensity, humidity, isSimulationRunning]);

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

  const updateDevice = (deviceName, updates) => {
    setDevices(prev => ({
      ...prev,
      [deviceName]: { ...prev[deviceName], ...updates }
    }));
  };

  const resetSimulation = () => {
    setOccupancy(0);
    setPeopleInside([]);
    setPeopleOutside([
      { id: 1, name: 'Person 1' },
      { id: 2, name: 'Person 2' },
      { id: 3, name: 'Person 3' },
      { id: 4, name: 'Person 4' },
      { id: 5, name: 'Person 5' },
    ]);
    setPowerHistory([]);
    setDevices({
      light: { isOn: true, intensity: 100, powerConsumption: 60 },
      fan: { isOn: true, speed: 3, powerConsumption: 75 },
      ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
    });
    setIsSimulationRunning(false);
  };

  const value = {
    automationMode, occupancy, peopleOutside, peopleInside,
    timeOfDay, sunlightIntensity, temperature, humidity,
    devices, powerHistory, totalPowerConsumption,
    isSimulationRunning, backendStatus,
    setAutomationMode, movePerson, setTimeOfDay,
    setSunlightIntensity, setTemperature, setHumidity,
    updateDevice, toggleAutomation, resetSimulation,
    totalEnergySaved, sessionDuration
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

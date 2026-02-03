import { createContext, useContext, useState, useEffect, useRef } from 'react';
import ApiService from '../services/api';

const BuildingContext = createContext();

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error('useBuildingContext must be used within BuildingProvider');
  }
  return context;
};

// Room type configurations
const ROOM_TYPES = {
  conference: {
    name: 'Conference Room',
    icon: '👥',
    baseTemp: 24,
    maxOccupancy: 10,
    description: 'Meeting and presentation space'
  },
  lab: {
    name: 'Computer Lab',
    icon: '💻',
    baseTemp: 22,
    maxOccupancy: 30,
    equipmentLoad: 1200,
    description: 'High-tech workspace with equipment'
  },
  server: {
    name: 'Server Room',
    icon: '🖥️',
    baseTemp: 18,
    maxOccupancy: 2,
    criticalCooling: true,
    description: 'Critical infrastructure - 24/7 operation'
  },
  cafeteria: {
    name: 'Cafeteria',
    icon: '🍽️',
    baseTemp: 25,
    maxOccupancy: 50,
    description: 'Dining area with variable occupancy'
  },
  office: {
    name: 'Office Space',
    icon: '📋',
    baseTemp: 24,
    maxOccupancy: 15,
    description: 'Standard workspace'
  },
  library: {
    name: 'Library',
    icon: '📚',
    baseTemp: 23,
    maxOccupancy: 25,
    description: 'Study area - minimal noise'
  },
  reception: {
    name: 'Reception',
    icon: '🏢',
    baseTemp: 24,
    maxOccupancy: 5,
    description: 'Front desk and waiting area'
  },
  storage: {
    name: 'Storage Room',
    icon: '📦',
    baseTemp: 26,
    maxOccupancy: 2,
    description: 'Inventory and storage'
  }
};

export const BuildingProvider = ({ children }) => {
  // Campus-wide settings
  const [automationMode, setAutomationMode] = useState('rule-based');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [sunlightIntensity, setSunlightIntensity] = useState(80);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationStartTime, setSimulationStartTime] = useState(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Building data
  const [buildings, setBuildings] = useState([
    {
      id: 'building-a',
      name: 'Engineering Block',
      color: 'blue',
      rooms: [
        {
          id: 'room-a1',
          buildingId: 'building-a',
          name: 'Conference Room A',
          type: 'conference',
          floor: 1,
          occupancy: 0,
          temperature: 28,
          humidity: 60,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 60 },
            fan: { isOn: true, speed: 3, powerConsumption: 75 },
            ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
          },
          people: []
        },
        {
          id: 'room-a2',
          buildingId: 'building-a',
          name: 'Computer Lab',
          type: 'lab',
          floor: 2,
          occupancy: 0,
          temperature: 26,
          humidity: 55,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 80 },
            fan: { isOn: true, speed: 3, powerConsumption: 75 },
            ac: { isOn: true, mode: 'cooling', temperature: 22, speed: 3, powerConsumption: 1500 }
          },
          equipmentPower: 1200,
          people: []
        },
        {
          id: 'room-a3',
          buildingId: 'building-a',
          name: 'Library',
          type: 'library',
          floor: 1,
          occupancy: 0,
          temperature: 24,
          humidity: 50,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 100 },
            fan: { isOn: true, speed: 3, powerConsumption: 75 },
            ac: { isOn: true, mode: 'cooling', temperature: 23, speed: 3, powerConsumption: 1500 }
          },
          people: []
        },
        {
          id: 'room-a4',
          buildingId: 'building-a',
          name: 'Cafeteria',
          type: 'cafeteria',
          floor: 0,
          occupancy: 0,
          temperature: 27,
          humidity: 65,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 120 },
            fan: { isOn: true, speed: 3, powerConsumption: 150 },
            ac: { isOn: true, mode: 'cooling', temperature: 25, speed: 3, powerConsumption: 2000 }
          },
          people: []
        }
      ]
    },
    {
      id: 'building-b',
      name: 'Administrative Block',
      color: 'green',
      rooms: [
        {
          id: 'room-b1',
          buildingId: 'building-b',
          name: 'Server Room',
          type: 'server',
          floor: 0,
          occupancy: 0,
          temperature: 20,
          humidity: 45,
          devices: {
            light: { isOn: false, intensity: 0, powerConsumption: 0 },
            fan: { isOn: true, speed: 3, powerConsumption: 100 },
            ac: { isOn: true, mode: 'cooling', temperature: 18, speed: 3, powerConsumption: 2500 }
          },
          equipmentPower: 3000,
          critical: true,
          people: []
        },
        {
          id: 'room-b2',
          buildingId: 'building-b',
          name: 'Office Space',
          type: 'office',
          floor: 1,
          occupancy: 0,
          temperature: 25,
          humidity: 55,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 80 },
            fan: { isOn: true, speed: 3, powerConsumption: 75 },
            ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 3, powerConsumption: 1500 }
          },
          people: []
        },
        {
          id: 'room-b3',
          buildingId: 'building-b',
          name: 'Reception',
          type: 'reception',
          floor: 0,
          occupancy: 1,
          temperature: 24,
          humidity: 50,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 60 },
            fan: { isOn: true, speed: 2, powerConsumption: 50 },
            ac: { isOn: true, mode: 'cooling', temperature: 24, speed: 2, powerConsumption: 1000 }
          },
          people: [{ id: 'receptionist', name: 'Receptionist', fixed: true }]
        },
        {
          id: 'room-b4',
          buildingId: 'building-b',
          name: 'Storage Room',
          type: 'storage',
          floor: 0,
          occupancy: 0,
          temperature: 28,
          humidity: 60,
          devices: {
            light: { isOn: true, intensity: 100, powerConsumption: 40 },
            fan: { isOn: false, speed: 0, powerConsumption: 0 },
            ac: { isOn: false, mode: 'off', temperature: 24, speed: 0, powerConsumption: 0 }
          },
          people: []
        }
      ]
    }
  ]);

  // Campus metrics
  const [campusMetrics, setCampusMetrics] = useState({
    totalPower: 0,
    totalEnergySaved: 0,
    totalCostSaved: 0,
    totalCO2Prevented: 0,
    efficiency: 0,
    monthlyBudget: 0,
    sessionDuration: 0,
    baselinePower: 0
  });

  // ✅ Refs to track state and prevent race conditions
  const isUpdatingRef = useRef(false);
  const automationModeRef = useRef(automationMode);
  const timeOfDayRef = useRef(timeOfDay);
  const sunlightIntensityRef = useRef(sunlightIntensity);

  // ✅ Keep refs synced with state
  useEffect(() => {
    automationModeRef.current = automationMode;
    timeOfDayRef.current = timeOfDay;
    sunlightIntensityRef.current = sunlightIntensity;
  }, [automationMode, timeOfDay, sunlightIntensity]);

  // Calculate room power
  const calculateRoomPower = (room) => {
    const devicePower = 
      (room.devices.light.isOn ? room.devices.light.powerConsumption : 0) +
      (room.devices.fan.isOn ? room.devices.fan.powerConsumption : 0) +
      (room.devices.ac.isOn ? room.devices.ac.powerConsumption : 0);
    
    const equipmentPower = room.equipmentPower || 0;
    return devicePower + equipmentPower;
  };

  // Calculate building metrics
  const calculateBuildingMetrics = (building) => {
    const totalPower = building.rooms.reduce((sum, room) => sum + calculateRoomPower(room), 0);
    const totalOccupancy = building.rooms.reduce((sum, room) => sum + room.occupancy, 0);
    const avgTemperature = building.rooms.reduce((sum, room) => sum + room.temperature, 0) / building.rooms.length;
    
    return {
      totalPower,
      totalOccupancy,
      avgTemperature: avgTemperature.toFixed(1)
    };
  };

  // Update campus metrics
  useEffect(() => {
    const totalPower = buildings.reduce((sum, building) => {
      return sum + building.rooms.reduce((roomSum, room) => roomSum + calculateRoomPower(room), 0);
    }, 0);

    // Calculate baseline
    const baselinePower = buildings.reduce((sum, building) => {
      return sum + building.rooms.reduce((roomSum, room) => {
        const baselineDevices = 
          60 +
          75 +
          (room.type === 'server' ? 2500 : room.type === 'cafeteria' ? 2000 : 1500) +
          (room.equipmentPower || 0);
        return roomSum + baselineDevices;
      }, 0);
    }, 0);

    const powerSaved = baselinePower - totalPower;
    const efficiency = ((powerSaved / baselinePower) * 100).toFixed(1);

    let energySaved = 0;
    let costSaved = 0;
    let co2Prevented = 0;
    let sessionDuration = 0;

    if (isSimulationRunning && simulationStartTime) {
      sessionDuration = Math.floor((Date.now() - simulationStartTime) / 1000);
      const timeInHours = sessionDuration / 3600;
      energySaved = powerSaved * timeInHours;
      costSaved = (energySaved / 1000) * 8;
      co2Prevented = (energySaved / 1000) * 0.82;
    }

    const monthlyBudget = (totalPower * 24 * 30) / 1000 * 8;

    setCampusMetrics({
      totalPower,
      totalEnergySaved: energySaved,
      totalCostSaved: costSaved,
      totalCO2Prevented: co2Prevented,
      efficiency: parseFloat(efficiency),
      monthlyBudget: monthlyBudget.toFixed(0),
      sessionDuration,
      baselinePower
    });
  }, [buildings, isSimulationRunning, simulationStartTime]);

  // ✅ EFFECT 1: Immediate update when automation settings change
  useEffect(() => {
    if (!isSimulationRunning) return;

    const updateDevices = async () => {
      if (isUpdatingRef.current) return;
      
      isUpdatingRef.current = true;
      setIsLoading(true);
      setApiError(null);

      console.log('🔄 Immediate update triggered. Mode:', automationMode);

      try {
        setBuildings(currentBuildings => {
          const apiCalls = [];
          const roomMap = [];

          currentBuildings.forEach(building => {
            building.rooms.forEach(room => {
              apiCalls.push(
                ApiService.calculateDeviceSettings({
                  automationMode,
                  occupancy: room.occupancy,
                  temperature: room.temperature,
                  timeOfDay,
                  sunlightIntensity,
                  humidity: room.humidity,
                  roomType: room.type
                })
              );
              roomMap.push({ buildingId: building.id, roomId: room.id });
            });
          });

          Promise.all(apiCalls)
            .then(responses => {
              setBuildings(prevBuildings =>
                prevBuildings.map(building => ({
                  ...building,
                  rooms: building.rooms.map(room => {
                    const roomIndex = roomMap.findIndex(
                      rm => rm.buildingId === building.id && rm.roomId === room.id
                    );
                    
                    if (roomIndex !== -1 && responses[roomIndex]?.success) {
                      return {
                        ...room,
                        devices: responses[roomIndex].devices
                      };
                    }
                    return room;
                  })
                }))
              );
              setIsLoading(false);
              isUpdatingRef.current = false;
            })
            .catch(error => {
              console.error('Device update failed:', error);
              setApiError('Backend not responding. Start server: cd backend && npm run dev');
              setIsLoading(false);
              isUpdatingRef.current = false;
            });

          return currentBuildings;
        });
      } catch (error) {
        console.error('Update error:', error);
        setApiError('Backend error');
        setIsLoading(false);
        isUpdatingRef.current = false;
      }
    };

    updateDevices();
  }, [automationMode, timeOfDay, sunlightIntensity, isSimulationRunning]);

  // ✅ EFFECT 2: Periodic refresh (uses refs to avoid recreating interval)
  useEffect(() => {
    if (!isSimulationRunning) return;

    console.log('🔄 Starting 5-second periodic refresh');

    const interval = setInterval(async () => {
      if (isUpdatingRef.current) return;
      
      isUpdatingRef.current = true;

      console.log('⏰ Periodic update. Current mode:', automationModeRef.current);

      setBuildings(currentBuildings => {
        const apiCalls = [];
        const roomMap = [];

        currentBuildings.forEach(building => {
          building.rooms.forEach(room => {
            apiCalls.push(
              ApiService.calculateDeviceSettings({
                automationMode: automationModeRef.current, // ✅ Use ref
                occupancy: room.occupancy,
                temperature: room.temperature,
                timeOfDay: timeOfDayRef.current, // ✅ Use ref
                sunlightIntensity: sunlightIntensityRef.current, // ✅ Use ref
                humidity: room.humidity,
                roomType: room.type
              })
            );
            roomMap.push({ buildingId: building.id, roomId: room.id });
          });
        });

        Promise.all(apiCalls)
          .then(responses => {
            setBuildings(prevBuildings =>
              prevBuildings.map(building => ({
                ...building,
                rooms: building.rooms.map(room => {
                  const roomIndex = roomMap.findIndex(
                    rm => rm.buildingId === building.id && rm.roomId === room.id
                  );
                  
                  if (roomIndex !== -1 && responses[roomIndex]?.success) {
                    return {
                      ...room,
                      devices: responses[roomIndex].devices
                    };
                  }
                  return room;
                })
              }))
            );
            isUpdatingRef.current = false;
          })
          .catch(error => {
            console.error('Periodic update failed:', error);
            isUpdatingRef.current = false;
          });

        return currentBuildings;
      });
    }, 5000);

    return () => {
      console.log('🛑 Stopping periodic refresh');
      clearInterval(interval);
    };
  }, [isSimulationRunning]); // ✅ Only recreates when simulation starts/stops

  // Move person
  const movePerson = (buildingId, roomId, personId, toRoom = true) => {
    setBuildings(prev => prev.map(building => {
      if (building.id !== buildingId) return building;

      return {
        ...building,
        rooms: building.rooms.map(room => {
          if (room.id !== roomId) return room;

          if (toRoom) {
            const newPerson = personId || {
              id: `person-${Date.now()}`,
              name: `Person ${room.people.length + 1}`
            };
            
            return {
              ...room,
              occupancy: room.occupancy + 1,
              people: [...room.people, newPerson]
            };
          } else {
            const personToRemove = room.people.find(p => p.id === personId);
            if (personToRemove?.fixed) return room;

            return {
              ...room,
              occupancy: Math.max(0, room.occupancy - 1),
              people: room.people.filter(p => p.id !== personId)
            };
          }
        })
      };
    }));
  };

  // Update temperature
  const updateRoomTemperature = (buildingId, roomId, temperature) => {
    setBuildings(prev => prev.map(building => {
      if (building.id !== buildingId) return building;
      
      return {
        ...building,
        rooms: building.rooms.map(room => 
          room.id === roomId ? { ...room, temperature } : room
        )
      };
    }));
  };

  // Toggle simulation
  const toggleSimulation = () => {
    setIsSimulationRunning(prev => {
      const newState = !prev;
      if (newState) {
        setSimulationStartTime(Date.now());
        setApiError(null);
      }
      return newState;
    });
  };

  // Reset
  const resetSimulation = () => {
    window.location.reload();
  };

  const value = {
    buildings,
    campusMetrics,
    automationMode,
    timeOfDay,
    sunlightIntensity,
    isSimulationRunning,
    isLoading,
    apiError,
    ROOM_TYPES,
    setAutomationMode,
    setTimeOfDay,
    setSunlightIntensity,
    movePerson,
    updateRoomTemperature,
    toggleSimulation,
    resetSimulation,
    calculateBuildingMetrics,
    calculateRoomPower
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};

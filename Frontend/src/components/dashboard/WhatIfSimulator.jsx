import { useState } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { Lightbulb, Users, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatIfSimulator = () => {
  const { buildings, campusMetrics, ROOM_TYPES } = useBuildingContext();
  const [isOpen, setIsOpen] = useState(false);
  const [scenario, setScenario] = useState('full');
  const [simulationResult, setSimulationResult] = useState(null);

  const scenarios = {
    full: {
      name: 'Full Occupancy',
      description: 'All rooms at maximum capacity',
      icon: '👥',
      color: 'blue'
    },
    empty: {
      name: 'All Empty',
      description: 'No one in any room',
      icon: '🚪',
      color: 'gray'
    },
    peak: {
      name: 'Peak Hours',
      description: '80% occupancy across campus',
      icon: '📈',
      color: 'orange'
    },
    nightMode: {
      name: 'Night Mode',
      description: 'Minimal lighting, no AC',
      icon: '🌙',
      color: 'purple'
    },
    serverCrisis: {
      name: 'Server Crisis',
      description: 'All server rooms at 30°C',
      icon: '🚨',
      color: 'red'
    }
  };

  const runSimulation = () => {
    let totalPower = 0;
    let totalOccupancy = 0;
    let roomDetails = [];

    buildings.forEach(building => {
      building.rooms.forEach(room => {
        const roomConfig = ROOM_TYPES[room.type];
        let simulatedOccupancy = room.occupancy;
        let simulatedTemp = room.temperature;
        let devices = { ...room.devices };

        // Apply scenario
        switch (scenario) {
          case 'full':
            simulatedOccupancy = roomConfig?.maxOccupancy || 10;
            break;
          case 'empty':
            simulatedOccupancy = 0;
            break;
          case 'peak':
            simulatedOccupancy = Math.round((roomConfig?.maxOccupancy || 10) * 0.8);
            break;
          case 'nightMode':
            simulatedOccupancy = room.occupancy;
            devices.light.isOn = false;
            devices.light.intensity = 0;
            devices.light.powerConsumption = 0;
            devices.ac.isOn = false;
            devices.ac.powerConsumption = 0;
            break;
          case 'serverCrisis':
            if (room.type === 'server') {
              simulatedTemp = 30;
              devices.ac.isOn = true;
              devices.ac.speed = 3;
              devices.ac.powerConsumption = 3000;
            }
            break;
        }

        // Calculate power based on scenario
        if (scenario !== 'nightMode') {
          if (simulatedOccupancy > 0) {
            // Light
            devices.light.isOn = true;
            devices.light.intensity = Math.min(30 + simulatedOccupancy * 10, 100);
            const lightWattage = room.type === 'cafeteria' ? 120 : room.type === 'lab' ? 80 : 60;
            devices.light.powerConsumption = Math.round((devices.light.intensity / 100) * lightWattage);

            // AC based on occupancy
            if (simulatedOccupancy > 5 || simulatedTemp > 26) {
              devices.ac.isOn = true;
              devices.ac.speed = Math.min(Math.ceil(simulatedOccupancy / 5), 3);
              devices.ac.powerConsumption = 500 * devices.ac.speed;
            }

            // Fan
            if (simulatedOccupancy > 3) {
              devices.fan.isOn = true;
              devices.fan.speed = Math.min(Math.ceil(simulatedOccupancy / 5), 3);
              devices.fan.powerConsumption = 25 * devices.fan.speed;
            }
          } else {
            devices.light.isOn = false;
            devices.light.intensity = 0;
            devices.light.powerConsumption = 0;
            devices.fan.isOn = false;
            devices.fan.powerConsumption = 0;
            devices.ac.isOn = false;
            devices.ac.powerConsumption = 0;
          }
        }

        const roomPower = 
          devices.light.powerConsumption +
          devices.fan.powerConsumption +
          devices.ac.powerConsumption +
          (room.equipmentPower || 0);

        totalPower += roomPower;
        totalOccupancy += simulatedOccupancy;

        roomDetails.push({
          name: room.name,
          building: building.name,
          occupancy: simulatedOccupancy,
          maxOccupancy: roomConfig?.maxOccupancy || 10,
          power: roomPower,
          devices
        });
      });
    });

    const baselinePower = campusMetrics.baselinePower;
    const efficiency = ((baselinePower - totalPower) / baselinePower * 100).toFixed(1);
    const monthlyCost = (totalPower * 24 * 30 / 1000 * 8).toFixed(0);
    const co2Monthly = (totalPower * 24 * 30 / 1000 * 0.82).toFixed(1);

    setSimulationResult({
      totalPower,
      totalOccupancy,
      efficiency: parseFloat(efficiency),
      monthlyCost,
      co2Monthly,
      roomDetails: roomDetails.sort((a, b) => b.power - a.power).slice(0, 5),
      comparisonWithCurrent: {
        powerDiff: totalPower - campusMetrics.totalPower,
        efficiencyDiff: parseFloat(efficiency) - campusMetrics.efficiency
      }
    });
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb size={32} />
            <div className="text-left">
              <h3 className="text-lg font-bold">What-If Simulator</h3>
              <p className="text-sm text-purple-100">Test different scenarios</p>
            </div>
          </div>
          <div className="text-3xl">🎮</div>
        </div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      🎮 What-If Simulator
                    </h2>
                    <p className="text-purple-100 mt-1">Predict campus performance under different scenarios</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Scenario Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Select Scenario</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(scenarios).map(([key, s]) => (
                      <button
                        key={key}
                        onClick={() => setScenario(key)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          scenario === key
                            ? `border-${s.color}-500 bg-${s.color}-50 shadow-lg scale-105`
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-3xl mb-2">{s.icon}</div>
                        <h4 className="font-bold text-gray-800">{s.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{s.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Run Button */}
                <button
                  onClick={runSimulation}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <TrendingUp size={24} />
                  Run Simulation
                </button>

                {/* Results */}
                {simulationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold text-gray-800">Simulation Results</h3>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300">
                        <p className="text-sm text-gray-600 mb-1">Total Power</p>
                        <p className="text-3xl font-bold text-yellow-600">{simulationResult.totalPower}W</p>
                        <p className={`text-xs mt-1 ${simulationResult.comparisonWithCurrent.powerDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {simulationResult.comparisonWithCurrent.powerDiff > 0 ? '↑' : '↓'} {Math.abs(simulationResult.comparisonWithCurrent.powerDiff).toFixed(0)}W
                        </p>
                      </div>

                      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300">
                        <p className="text-sm text-gray-600 mb-1">Total People</p>
                        <p className="text-3xl font-bold text-blue-600">{simulationResult.totalOccupancy}</p>
                      </div>

                      <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
                        <p className="text-sm text-gray-600 mb-1">Efficiency</p>
                        <p className="text-3xl font-bold text-green-600">{simulationResult.efficiency}%</p>
                        <p className={`text-xs mt-1 ${simulationResult.comparisonWithCurrent.efficiencyDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {simulationResult.comparisonWithCurrent.efficiencyDiff > 0 ? '↑' : '↓'} {Math.abs(simulationResult.comparisonWithCurrent.efficiencyDiff).toFixed(1)}%
                        </p>
                      </div>

                      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
                        <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
                        <p className="text-3xl font-bold text-purple-600">₹{simulationResult.monthlyCost}</p>
                      </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
                      <h4 className="font-semibold text-gray-800 mb-2">Environmental Impact (Monthly)</h4>
                      <p className="text-lg">🌱 CO₂: {simulationResult.co2Monthly} kg</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Equivalent to {(simulationResult.co2Monthly / 21.77).toFixed(1)} trees 🌳
                      </p>
                    </div>

                    {/* Top 5 Power Consumers */}
                    <div className="card">
                      <h4 className="font-semibold text-gray-800 mb-3">Top 5 Power Consuming Rooms</h4>
                      <div className="space-y-2">
                        {simulationResult.roomDetails.map((room, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{room.name}</p>
                              <p className="text-xs text-gray-600">{room.building} • {room.occupancy}/{room.maxOccupancy} people</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-800">{room.power}W</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatIfSimulator;

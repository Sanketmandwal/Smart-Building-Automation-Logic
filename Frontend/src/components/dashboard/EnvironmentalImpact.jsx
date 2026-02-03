import { useBuildingContext } from '../../context/BuildingContext';
import { Leaf, Droplets, Wind, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const EnvironmentalImpact = () => {
  const { campusMetrics, isSimulationRunning } = useBuildingContext();

  // Calculate environmental metrics
  const co2Prevented = campusMetrics.totalCO2Prevented; // kg
  const treesEquivalent = (co2Prevented / 21.77).toFixed(1); // 1 tree absorbs ~21.77 kg CO2/year
  const energySavedKwh = (campusMetrics.totalEnergySaved / 1000).toFixed(2);
  const waterSaved = (energySavedKwh * 2.5).toFixed(1); // ~2.5L water per kWh for power generation
  const coalAvoided = (energySavedKwh * 0.85).toFixed(2); // ~0.85 kg coal per kWh

  // Monthly & Yearly projections
  const monthlyKwh = campusMetrics.sessionDuration > 0
    ? ((campusMetrics.totalEnergySaved / 1000) / (campusMetrics.sessionDuration / 3600)) * 24 * 30
    : 0;
  const yearlyCO2 = (monthlyKwh * 12 * 0.82).toFixed(0);
  const yearlyTrees = (yearlyCO2 / 21.77).toFixed(0);

  return (
    <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🌍 Environmental Impact
        </h3>
        {isSimulationRunning && (
          <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-semibold">
            LIVE TRACKING
          </span>
        )}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl p-5 shadow-md border-2 border-green-200"
        >
          <Leaf className="text-green-600 mb-2" size={32} />
          <p className="text-sm text-gray-600 mb-1">CO₂ Prevented</p>
          <p className="text-3xl font-bold text-green-700">{co2Prevented.toFixed(2)} kg</p>
          <p className="text-xs text-gray-500 mt-2">≈ {treesEquivalent} trees planted</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-md border-2 border-blue-200"
        >
          <Zap className="text-blue-600 mb-2" size={32} />
          <p className="text-sm text-gray-600 mb-1">Energy Saved</p>
          <p className="text-3xl font-bold text-blue-700">{energySavedKwh} kWh</p>
          <p className="text-xs text-gray-500 mt-2">Clean energy utilized</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-md border-2 border-cyan-200"
        >
          <Droplets className="text-cyan-600 mb-2" size={32} />
          <p className="text-sm text-gray-600 mb-1">Water Saved</p>
          <p className="text-3xl font-bold text-cyan-700">{waterSaved} L</p>
          <p className="text-xs text-gray-500 mt-2">From power generation</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-300"
        >
          <Wind className="text-gray-600 mb-2" size={32} />
          <p className="text-sm text-gray-600 mb-1">Coal Avoided</p>
          <p className="text-3xl font-bold text-gray-700">{coalAvoided} kg</p>
          <p className="text-xs text-gray-500 mt-2">Fossil fuel saved</p>
        </motion.div>
      </div>

      {/* Yearly Projection */}
      {isSimulationRunning && campusMetrics.sessionDuration > 60 && (
        <div className="bg-white rounded-xl p-5 shadow-md border-2 border-purple-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            📊 Yearly Projection
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{yearlyCO2} kg</p>
              <p className="text-xs text-gray-600 mt-1">CO₂ Prevented</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{(monthlyKwh * 12).toFixed(0)} kWh</p>
              <p className="text-xs text-gray-600 mt-1">Energy Saved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{yearlyTrees} 🌳</p>
              <p className="text-xs text-gray-600 mt-1">Tree Equivalent</p>
            </div>
          </div>
        </div>
      )}

      {/* Sustainability Score */}
      <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Campus Sustainability Score</p>
            <p className="text-4xl font-bold">{campusMetrics.efficiency.toFixed(0)}/100</p>
          </div>
          <div className="text-6xl">
            {campusMetrics.efficiency >= 80 ? '🌟' : 
             campusMetrics.efficiency >= 60 ? '⭐' : 
             campusMetrics.efficiency >= 40 ? '🌤️' : '🌱'}
          </div>
        </div>
        <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${campusMetrics.efficiency}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      {!isSimulationRunning && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-xs text-blue-800">
            ▶️ Start simulation to track real-time environmental impact
          </p>
        </div>
      )}
    </div>
  );
};

export default EnvironmentalImpact;

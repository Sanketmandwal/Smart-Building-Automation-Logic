import { useSimulation } from '../../context/SimulationContext';
import { Zap, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const PowerMeter = () => {
  const { 
    totalPowerConsumption, 
    automationMode,
    devices 
  } = useSimulation();

  // Baseline comparison (no automation = 1635W)
  const baselinePower = 1635;
  const savingsPercent = ((baselinePower - totalPowerConsumption) / baselinePower * 100).toFixed(1);
  const savingsWatts = baselinePower - totalPowerConsumption;

  // Get color based on power level
  const getPowerColor = () => {
    if (totalPowerConsumption > 1200) return 'red';
    if (totalPowerConsumption > 600) return 'yellow';
    return 'green';
  };

  const powerColor = getPowerColor();
  const colorClasses = {
    red: 'bg-red-500 text-red-700',
    yellow: 'bg-yellow-500 text-yellow-700',
    green: 'bg-green-500 text-green-700'
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Zap className="text-yellow-500" size={24} />
        Power Meter
      </h2>

      {/* Current Power Display */}
      <div className="text-center mb-6">
        <motion.div
          key={totalPowerConsumption}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-2"
        >
          <p className="text-5xl font-bold text-gray-800">
            {totalPowerConsumption}
            <span className="text-2xl text-gray-500 ml-1">W</span>
          </p>
        </motion.div>
        <p className="text-sm text-gray-600">Current Power Consumption</p>
      </div>

      {/* Power Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
          <motion.div
            className={`h-full ${colorClasses[powerColor]} transition-colors duration-500`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalPowerConsumption / baselinePower) * 100, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-700">
              {((totalPowerConsumption / baselinePower) * 100).toFixed(0)}% of max
            </span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0W</span>
          <span>{baselinePower}W (No Automation)</span>
        </div>
      </div>

      {/* Savings Display */}
      {automationMode !== 'none' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 rounded-lg border border-green-200 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Energy Saved</span>
            <TrendingDown className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-green-700 mb-1">
            {savingsPercent}%
          </p>
          <p className="text-xs text-green-600">
            {savingsWatts}W savings vs. no automation
          </p>
        </motion.div>
      )}

      {/* Device Breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Power Breakdown</h3>
        
        {/* Light */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              devices.light.isOn ? 'bg-yellow-500' : 'bg-gray-300'
            }`}></div>
            <span className="text-sm text-gray-700">Lighting</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {devices.light.isOn ? devices.light.powerConsumption : 0}W
          </span>
        </div>

        {/* Fan */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              devices.fan.isOn ? 'bg-blue-500' : 'bg-gray-300'
            }`}></div>
            <span className="text-sm text-gray-700">Fan</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {devices.fan.isOn ? devices.fan.powerConsumption : 0}W
          </span>
        </div>

        {/* AC */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              devices.ac.isOn ? 'bg-cyan-500' : 'bg-gray-300'
            }`}></div>
            <span className="text-sm text-gray-700">Air Conditioner</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {devices.ac.isOn ? devices.ac.powerConsumption : 0}W
          </span>
        </div>

        {/* Total Line */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
          <span className="text-sm font-semibold text-gray-800">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {totalPowerConsumption}W
          </span>
        </div>
      </div>

      {/* Mode Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Current Mode:</span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            automationMode === 'none' ? 'bg-red-100 text-red-700' :
            automationMode === 'rule-based' ? 'bg-blue-100 text-blue-700' :
            'bg-green-100 text-green-700'
          }`}>
            {automationMode === 'none' ? 'No Automation' :
             automationMode === 'rule-based' ? 'Rule-Based' :
             'Context-Aware'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PowerMeter;

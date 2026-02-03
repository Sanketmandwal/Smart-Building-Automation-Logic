import { useState, useEffect } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveCostTicker = () => {
  const { campusMetrics, isSimulationRunning } = useBuildingContext();
  const [liveCost, setLiveCost] = useState(0);
  const [previousCost, setPreviousCost] = useState(0);

  useEffect(() => {
    if (!isSimulationRunning) {
      setLiveCost(0);
      return;
    }

    const interval = setInterval(() => {
      // Calculate cost per second: (power in W * hours) / 1000 * rate
      const costPerSecond = (campusMetrics.totalPower / 3600 / 1000) * 8;
      
      setLiveCost(prev => {
        setPreviousCost(prev);
        return prev + costPerSecond;
      });
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isSimulationRunning, campusMetrics.totalPower]);

  const trend = liveCost > previousCost ? 'up' : liveCost < previousCost ? 'down' : 'stable';

  // Format number with animation
  const formatCurrency = (value) => {
    return value.toFixed(4);
  };

  return (
    <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="text-green-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-800">Live Cost Meter</h3>
        </div>
        {isSimulationRunning && (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
      </div>

      {/* Main Cost Display */}
      <div className="text-center mb-4">
        <motion.div 
          className="text-5xl font-bold text-green-600 font-mono flex items-center justify-center gap-2"
          key={Math.floor(liveCost * 100)} // Re-render on change
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          ₹ {formatCurrency(liveCost)}
          {trend === 'up' && <TrendingUp className="text-red-500" size={32} />}
          {trend === 'down' && <TrendingDown className="text-green-500" size={32} />}
        </motion.div>
        <p className="text-sm text-gray-600 mt-2">
          {isSimulationRunning ? 'Current Session Cost' : 'Start simulation to begin'}
        </p>
      </div>

      {/* Rate Info */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-green-200">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Per Second</p>
          <p className="text-lg font-bold text-green-700">
            ₹{((campusMetrics.totalPower / 3600 / 1000) * 8).toFixed(6)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Per Minute</p>
          <p className="text-lg font-bold text-green-700">
            ₹{((campusMetrics.totalPower / 60 / 1000) * 8).toFixed(4)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-1">Per Hour</p>
          <p className="text-lg font-bold text-green-700">
            ₹{((campusMetrics.totalPower / 1000) * 8).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Savings Comparison */}
      {campusMetrics.efficiency > 0 && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Without Automation</p>
              <p className="text-xl font-bold text-red-600">
                ₹{(liveCost / (1 - campusMetrics.efficiency / 100)).toFixed(4)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-600">You Saved</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(liveCost / (1 - campusMetrics.efficiency / 100) - liveCost).toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress to next milestone */}
      {isSimulationRunning && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Next Milestone</span>
            <span className="font-bold text-green-600">₹{Math.ceil(liveCost)}.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${((liveCost % 1) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCostTicker;

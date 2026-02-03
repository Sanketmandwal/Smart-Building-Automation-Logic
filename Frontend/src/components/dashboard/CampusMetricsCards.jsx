import { useBuildingContext } from '../../context/BuildingContext';
import { Zap, TrendingDown, DollarSign, Leaf, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const CampusMetricsCards = () => {
  const { campusMetrics, isSimulationRunning } = useBuildingContext();

  // Format duration
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const metrics = [
    {
      title: 'Total Campus Power',
      value: `${campusMetrics.totalPower.toLocaleString()}W`,
      icon: <Zap className="text-yellow-500" size={28} />,
      color: 'from-yellow-400 to-orange-500',
      subtitle: `Baseline: ${campusMetrics.baselinePower.toLocaleString()}W`
    },
    {
      title: 'Energy Efficiency',
      value: `${campusMetrics.efficiency}%`,
      icon: <TrendingDown className="text-green-500" size={28} />,
      color: 'from-green-400 to-emerald-500',
      subtitle: 'vs No Automation'
    },
    {
      title: 'Cost Savings',
      value: `₹${campusMetrics.totalCostSaved.toFixed(2)}`,
      icon: <DollarSign className="text-blue-500" size={28} />,
      color: 'from-blue-400 to-cyan-500',
      subtitle: isSimulationRunning ? 'This Session' : 'Start to track'
    },
    {
      title: 'CO₂ Prevented',
      value: `${campusMetrics.totalCO2Prevented.toFixed(2)} kg`,
      icon: <Leaf className="text-emerald-500" size={28} />,
      color: 'from-emerald-400 to-green-500',
      subtitle: `≈ ${(campusMetrics.totalCO2Prevented / 21.77).toFixed(1)} trees`
    },
    {
      title: 'Monthly Budget',
      value: `₹${parseInt(campusMetrics.monthlyBudget).toLocaleString()}`,
      icon: <Activity className="text-purple-500" size={28} />,
      color: 'from-purple-400 to-pink-500',
      subtitle: 'Projected cost'
    },
    {
      title: 'Session Duration',
      value: formatDuration(campusMetrics.sessionDuration),
      icon: <Clock className="text-indigo-500" size={28} />,
      color: 'from-indigo-400 to-purple-500',
      subtitle: isSimulationRunning ? '🟢 Running...' : '🔴 Stopped'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-10`}></div>
          <div className="relative p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                {metric.icon}
              </div>
              {isSimulationRunning && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className="text-3xl font-bold text-gray-800 mb-1">{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CampusMetricsCards;

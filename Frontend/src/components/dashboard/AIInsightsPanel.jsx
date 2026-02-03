import { useState, useEffect } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { Brain, AlertTriangle, TrendingUp, Lightbulb, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIInsightsPanel = () => {
  const { buildings, campusMetrics, automationMode, isSimulationRunning } = useBuildingContext();
  const [insights, setInsights] = useState([]);

  // Generate REAL insights from actual room data
  useEffect(() => {
    const newInsights = [];

    // Analyze each room for real issues
    buildings.forEach(building => {
      building.rooms.forEach(room => {
        const roomPower =
          (room.devices.light.powerConsumption || 0) +
          (room.devices.fan.powerConsumption || 0) +
          (room.devices.ac.powerConsumption || 0) +
          (room.equipmentPower || 0);

        // INSIGHT 1: Empty room wasting energy
        if (room.occupancy === 0 && roomPower > 100) {
          newInsights.push({
            id: `empty-${room.id}`,
            type: 'warning',
            priority: 'high',
            icon: <AlertTriangle size={20} />,
            title: 'Energy Waste Detected',
            message: `${room.name} is empty but consuming ${roomPower}W`,
            room: room.name,
            building: building.name,
            action: automationMode === 'none' ? 'Enable automation to fix' : 'Optimizing...',
            savings: `₹${((roomPower * 24 * 30) / 1000 * 8).toFixed(0)}/month potential`
          });
        }

        // INSIGHT 2: Server room temperature critical
        if (room.type === 'server' && room.temperature > 22) {
          newInsights.push({
            id: `temp-${room.id}`,
            type: 'critical',
            priority: 'critical',
            icon: <AlertTriangle size={20} />,
            title: 'Critical Temperature Alert',
            message: `${room.name} at ${room.temperature}°C - Equipment risk!`,
            room: room.name,
            building: building.name,
            action: 'Maximum cooling activated',
            savings: null
          });
        }

        // INSIGHT 3: High occupancy room
        const maxOccupancy = room.type === 'cafeteria' ? 50 : 
                            room.type === 'lab' ? 30 : 
                            room.type === 'conference' ? 10 : 15;
        
        if (room.occupancy > maxOccupancy * 0.8) {
          newInsights.push({
            id: `crowd-${room.id}`,
            type: 'info',
            priority: 'medium',
            icon: <TrendingUp size={20} />,
            title: 'High Occupancy Detected',
            message: `${room.name} is ${((room.occupancy / maxOccupancy) * 100).toFixed(0)}% full (${room.occupancy}/${maxOccupancy})`,
            room: room.name,
            building: building.name,
            action: automationMode !== 'none' ? 'Cooling increased automatically' : 'Manual adjustment needed',
            savings: null
          });
        }

        // INSIGHT 4: Lab equipment running with no users
        if (room.type === 'lab' && room.equipmentPower > 1000 && room.occupancy === 0) {
          newInsights.push({
            id: `lab-${room.id}`,
            type: 'suggestion',
            priority: 'medium',
            icon: <Lightbulb size={20} />,
            title: 'Equipment Optimization',
            message: `${room.name} equipment using ${room.equipmentPower}W with no users`,
            room: room.name,
            building: building.name,
            action: 'Consider off-peak scheduling',
            savings: `₹${((room.equipmentPower * 8 * 30) / 1000 * 8).toFixed(0)}/month`
          });
        }

        // INSIGHT 5: Inefficient cooling (AC + high temp)
        if (room.devices.ac.isOn && room.temperature > 28) {
          newInsights.push({
            id: `inefficient-${room.id}`,
            type: 'warning',
            priority: 'medium',
            icon: <Zap size={20} />,
            title: 'Inefficient Cooling',
            message: `${room.name} AC running but temp still ${room.temperature}°C`,
            room: room.name,
            building: building.name,
            action: automationMode === 'context-aware' ? 'AI adjusting strategy' : 'Increase AC speed',
            savings: null
          });
        }

        // INSIGHT 6: Optimal performance
        if (room.occupancy > 0 && roomPower < 500 && room.temperature >= 22 && room.temperature <= 26) {
          newInsights.push({
            id: `optimal-${room.id}`,
            type: 'success',
            priority: 'low',
            icon: <CheckCircle size={20} />,
            title: 'Optimal Performance',
            message: `${room.name} running efficiently`,
            room: room.name,
            building: building.name,
            action: `${roomPower}W • ${room.temperature}°C • ${room.occupancy} people`,
            savings: null
          });
        }
      });
    });

    // INSIGHT 7: Campus-level efficiency
    if (campusMetrics.efficiency > 70) {
      newInsights.push({
        id: 'campus-efficient',
        type: 'success',
        priority: 'low',
        icon: <CheckCircle size={20} />,
        title: 'Excellent Campus Performance',
        message: `Operating at ${campusMetrics.efficiency}% efficiency`,
        room: 'Campus-wide',
        building: 'All Buildings',
        action: `Saving ₹${campusMetrics.totalCostSaved.toFixed(2)} so far`,
        savings: null
      });
    } else if (campusMetrics.efficiency < 40) {
      newInsights.push({
        id: 'campus-inefficient',
        type: 'warning',
        priority: 'high',
        icon: <AlertTriangle size={20} />,
        title: 'Low Campus Efficiency',
        message: `Only ${campusMetrics.efficiency}% efficient`,
        room: 'Campus-wide',
        building: 'All Buildings',
        action: 'Enable smart automation modes',
        savings: `₹${((campusMetrics.baselinePower - campusMetrics.totalPower) * 24 * 30 / 1000 * 8).toFixed(0)}/month potential`
      });
    }

    // INSIGHT 8: No automation warning
    if (automationMode === 'none' && isSimulationRunning) {
      newInsights.push({
        id: 'no-automation',
        type: 'warning',
        priority: 'high',
        icon: <AlertTriangle size={20} />,
        title: 'Automation Disabled',
        message: 'Running without optimization',
        room: 'Campus-wide',
        building: 'All Buildings',
        action: 'Switch to Rule-Based or AI mode',
        savings: `₹${((campusMetrics.baselinePower * 0.6 * 24 * 30) / 1000 * 8).toFixed(0)}/month potential`
      });
    }

    // INSIGHT 9: Context-aware benefits
    if (automationMode === 'context-aware' && isSimulationRunning) {
      newInsights.push({
        id: 'ai-active',
        type: 'info',
        priority: 'low',
        icon: <Brain size={20} />,
        title: 'AI Mode Active',
        message: 'Learning patterns and predicting needs',
        room: 'Campus-wide',
        building: 'All Buildings',
        action: '5-10% better than rule-based mode',
        savings: null
      });
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    newInsights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Keep top 8 insights
    setInsights(newInsights.slice(0, 8));
  }, [buildings, campusMetrics, automationMode, isSimulationRunning]);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'critical':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'suggestion':
        return 'border-blue-500 bg-blue-50 text-blue-800';
      case 'success':
        return 'border-green-500 bg-green-50 text-green-800';
      case 'info':
        return 'border-purple-500 bg-purple-50 text-purple-800';
      default:
        return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      critical: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${styles[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="card bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="text-purple-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">AI Insights</h3>
        </div>
        <div className="flex items-center gap-2">
          {isSimulationRunning && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
          <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full font-semibold">
            {insights.length} Active
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence>
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border-l-4 ${getTypeStyles(insight.type)} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      {getPriorityBadge(insight.priority)}
                    </div>
                    
                    <p className="text-xs mb-2 opacity-90">{insight.message}</p>
                    
                    <div className="flex items-center gap-2 text-[10px] opacity-70 mb-2">
                      <span>📍 {insight.room}</span>
                      <span>•</span>
                      <span>🏢 {insight.building}</span>
                    </div>
                    
                    {insight.action && (
                      <div className="text-xs font-medium mb-1 text-purple-700">
                        💡 {insight.action}
                      </div>
                    )}
                    
                    {insight.savings && (
                      <div className="inline-block text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-semibold">
                        💰 Save: {insight.savings}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Brain className="mx-auto mb-3" size={56} />
              <p className="text-base font-medium">All Systems Optimal</p>
              <p className="text-sm mt-2">
                {isSimulationRunning 
                  ? 'No issues detected. AI monitoring in progress...' 
                  : 'Start simulation to begin AI analysis'}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Status Footer */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">AI Mode:</span>
            <span className={`font-semibold ${
              automationMode === 'context-aware' ? 'text-green-600' : 'text-gray-500'
            }`}>
              {automationMode === 'context-aware' ? '🤖 Active' : '⏸️ Standby'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Analysis:</span>
            <span className="font-semibold text-purple-600">
              {isSimulationRunning ? 'Real-time' : 'Paused'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Insights:</span>
            <span className="font-semibold text-blue-600">{insights.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Critical:</span>
            <span className="font-semibold text-red-600">
              {insights.filter(i => i.priority === 'critical').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;

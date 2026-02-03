import { useState, useEffect } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PredictiveMaintenance = () => {
  const { buildings, campusMetrics, isSimulationRunning } = useBuildingContext();
  const [deviceUsage, setDeviceUsage] = useState({});

  // Track device usage hours
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setDeviceUsage(prev => {
        const updated = { ...prev };

        buildings.forEach(building => {
          building.rooms.forEach(room => {
            const roomKey = `${building.id}-${room.id}`;
            
            if (!updated[roomKey]) {
              updated[roomKey] = {
                light: 0,
                fan: 0,
                ac: 0,
                roomName: room.name,
                buildingName: building.name
              };
            }

            // Increment usage (in hours, 1 second = 1/3600 hours)
            if (room.devices.light.isOn) {
              updated[roomKey].light += 1 / 3600;
            }
            if (room.devices.fan.isOn) {
              updated[roomKey].fan += 1 / 3600;
            }
            if (room.devices.ac.isOn) {
              updated[roomKey].ac += 1 / 3600;
            }

            return updated;
          });
        });

        return updated;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isSimulationRunning, buildings]);

  // Maintenance thresholds (in hours)
  const MAINTENANCE_THRESHOLDS = {
    light: 1000, // 1000 hours
    fan: 2000,   // 2000 hours
    ac: 500      // 500 hours (more frequent for AC)
  };

  // Calculate maintenance alerts
  const getMaintenanceAlerts = () => {
    const alerts = [];

    Object.entries(deviceUsage).forEach(([roomKey, usage]) => {
      ['light', 'fan', 'ac'].forEach(device => {
        const hours = usage[device];
        const threshold = MAINTENANCE_THRESHOLDS[device];
        const percentage = (hours / threshold) * 100;

        if (percentage >= 90) {
          alerts.push({
            roomKey,
            roomName: usage.roomName,
            buildingName: usage.buildingName,
            device,
            hours: hours.toFixed(2),
            threshold,
            percentage: percentage.toFixed(1),
            priority: 'critical',
            message: `Maintenance required soon`,
            daysLeft: Math.max(0, Math.round((threshold - hours) / 24))
          });
        } else if (percentage >= 70) {
          alerts.push({
            roomKey,
            roomName: usage.roomName,
            buildingName: usage.buildingName,
            device,
            hours: hours.toFixed(2),
            threshold,
            percentage: percentage.toFixed(1),
            priority: 'warning',
            message: `Schedule maintenance`,
            daysLeft: Math.round((threshold - hours) / 24)
          });
        } else if (percentage >= 50) {
          alerts.push({
            roomKey,
            roomName: usage.roomName,
            buildingName: usage.buildingName,
            device,
            hours: hours.toFixed(2),
            threshold,
            percentage: percentage.toFixed(1),
            priority: 'info',
            message: `Monitor usage`,
            daysLeft: Math.round((threshold - hours) / 24)
          });
        }
      });
    });

    return alerts.sort((a, b) => b.percentage - a.percentage);
  };

  const alerts = getMaintenanceAlerts();

  const getDeviceIcon = (device) => {
    switch (device) {
      case 'light': return '💡';
      case 'fan': return '💨';
      case 'ac': return '❄️';
      default: return '🔧';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-300';
      case 'warning': return 'bg-orange-50 border-orange-300';
      case 'info': return 'bg-blue-50 border-blue-300';
      default: return 'bg-gray-50 border-gray-300';
    }
  };

  return (
    <div className="card bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wrench className="text-orange-600" size={28} />
          <h3 className="text-xl font-semibold text-gray-800">Predictive Maintenance</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-orange-600">{alerts.length}</p>
          <p className="text-xs text-gray-600">Active Alerts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-100 rounded-lg p-3 border-2 border-red-300">
          <p className="text-xs text-red-700 mb-1">Critical</p>
          <p className="text-2xl font-bold text-red-600">
            {alerts.filter(a => a.priority === 'critical').length}
          </p>
        </div>
        <div className="bg-orange-100 rounded-lg p-3 border-2 border-orange-300">
          <p className="text-xs text-orange-700 mb-1">Warning</p>
          <p className="text-2xl font-bold text-orange-600">
            {alerts.filter(a => a.priority === 'warning').length}
          </p>
        </div>
        <div className="bg-blue-100 rounded-lg p-3 border-2 border-blue-300">
          <p className="text-xs text-blue-700 mb-1">Monitor</p>
          <p className="text-2xl font-bold text-blue-600">
            {alerts.filter(a => a.priority === 'info').length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        <AnimatePresence>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <motion.div
                key={`${alert.roomKey}-${alert.device}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border-2 ${getPriorityBg(alert.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getDeviceIcon(alert.device)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800 capitalize">
                          {alert.device} - {alert.roomName}
                        </h4>
                        <p className="text-xs text-gray-600">{alert.buildingName}</p>
                      </div>
                      <span className={`text-xs font-bold text-white px-2 py-1 rounded-full uppercase ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                    </div>

                    {/* Usage Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{alert.hours}h / {alert.threshold}h</span>
                        <span className="font-bold">{alert.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            alert.priority === 'critical' ? 'bg-red-500' :
                            alert.priority === 'warning' ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${alert.percentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">
                        {alert.priority === 'critical' ? '🚨' : alert.priority === 'warning' ? '⚠️' : 'ℹ️'} {alert.message}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock size={12} />
                        {alert.daysLeft} days left
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="text-green-500 mx-auto mb-3" size={56} />
              <p className="text-lg font-semibold text-gray-700">All Systems Healthy! ✅</p>
              <p className="text-sm text-gray-600 mt-2">
                No maintenance required. Run simulation longer to see predictions.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-orange-200">
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-gray-600 mb-1">Light Threshold</p>
            <p className="font-bold text-gray-800">1000h</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Fan Threshold</p>
            <p className="font-bold text-gray-800">2000h</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">AC Threshold</p>
            <p className="font-bold text-gray-800">500h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveMaintenance;

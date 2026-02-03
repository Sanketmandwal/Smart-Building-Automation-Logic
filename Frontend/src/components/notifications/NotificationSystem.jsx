import { useEffect, useRef } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import toast, { Toaster } from 'react-hot-toast';
import { AlertTriangle, CheckCircle, TrendingUp, DollarSign, Zap } from 'lucide-react';

const NotificationSystem = () => {
  const { buildings, campusMetrics, automationMode, isSimulationRunning } = useBuildingContext();
  
  // Track milestones to avoid duplicate notifications
  const costMilestones = useRef(new Set());
  const efficiencyAlerted = useRef(false);
  const criticalRoomsAlerted = useRef(new Set());

  // Reset on simulation start
  useEffect(() => {
    if (isSimulationRunning) {
      costMilestones.current = new Set();
      efficiencyAlerted.current = false;
      criticalRoomsAlerted.current = new Set();
      
      toast.success('🚀 Simulation Started!', {
        duration: 3000,
        position: 'top-right',
      });
    }
  }, [isSimulationRunning]);

  // Check for cost milestones
  useEffect(() => {
    if (!isSimulationRunning) return;

    const cost = campusMetrics.totalCostSaved;
    const milestones = [1, 5, 10, 25, 50, 100];

    milestones.forEach(milestone => {
      if (cost >= milestone && !costMilestones.current.has(milestone)) {
        costMilestones.current.add(milestone);
        
        toast.success(
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-600" size={20} />
            <div>
              <p className="font-bold">Milestone Reached! 🎉</p>
              <p className="text-sm">You've saved ₹{milestone}!</p>
            </div>
          </div>,
          {
            duration: 5000,
            position: 'top-right',
            style: {
              background: '#10b981',
              color: '#fff',
            },
          }
        );
      }
    });
  }, [campusMetrics.totalCostSaved, isSimulationRunning]);

  // Check for high efficiency
  useEffect(() => {
    if (!isSimulationRunning) return;

    if (campusMetrics.efficiency >= 70 && !efficiencyAlerted.current) {
      efficiencyAlerted.current = true;
      
      toast.success(
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-600" size={20} />
          <div>
            <p className="font-bold">Excellent Performance! 🏆</p>
            <p className="text-sm">{campusMetrics.efficiency}% efficiency achieved!</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
    }
  }, [campusMetrics.efficiency, isSimulationRunning]);

  // Check for critical room temperatures
  useEffect(() => {
    if (!isSimulationRunning) return;

    buildings.forEach(building => {
      building.rooms.forEach(room => {
        const alertKey = `${room.id}-temp`;
        
        // Server room critical
        if (room.type === 'server' && room.temperature > 22 && !criticalRoomsAlerted.current.has(alertKey)) {
          criticalRoomsAlerted.current.add(alertKey);
          
          toast.error(
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              <div>
                <p className="font-bold">Critical Temperature! 🚨</p>
                <p className="text-sm">{room.name}: {room.temperature}°C</p>
              </div>
            </div>,
            {
              duration: 8000,
              position: 'top-right',
            }
          );
        }
        
        // Reset alert if temp is back to normal
        if (room.type === 'server' && room.temperature <= 20) {
          if (criticalRoomsAlerted.current.has(alertKey)) {
            criticalRoomsAlerted.current.delete(alertKey);
            
            toast.success(
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <p className="font-bold">Temperature Normal ✅</p>
                  <p className="text-sm">{room.name}: {room.temperature}°C</p>
                </div>
              </div>,
              {
                duration: 4000,
                position: 'top-right',
              }
            );
          }
        }
      });
    });
  }, [buildings, isSimulationRunning]);

  // Alert when automation mode changes
  useEffect(() => {
    if (!isSimulationRunning) return;

    const messages = {
      'none': '⚠️ Automation Disabled - Running at baseline',
      'rule-based': '⚙️ Rule-Based Mode Active',
      'context-aware': '🤖 AI Mode Active - Learning patterns'
    };

    if (messages[automationMode]) {
      toast(messages[automationMode], {
        duration: 3000,
        position: 'top-right',
        icon: automationMode === 'context-aware' ? '🤖' : automationMode === 'rule-based' ? '⚙️' : '⚠️',
      });
    }
  }, [automationMode]);

  // Empty room wasting energy
  useEffect(() => {
    if (!isSimulationRunning || automationMode === 'none') return;

    const interval = setInterval(() => {
      buildings.forEach(building => {
        building.rooms.forEach(room => {
          if (room.occupancy === 0 && room.type !== 'server') {
            const power = 
              (room.devices.light.isOn ? room.devices.light.powerConsumption : 0) +
              (room.devices.fan.isOn ? room.devices.fan.powerConsumption : 0) +
              (room.devices.ac.isOn ? room.devices.ac.powerConsumption : 0);

            if (power > 100) {
              toast.error(
                <div className="flex items-center gap-2">
                  <Zap className="text-yellow-600" size={20} />
                  <div>
                    <p className="font-bold">Energy Waste Detected!</p>
                    <p className="text-sm">{room.name} empty but using {power}W</p>
                  </div>
                </div>,
                {
                  duration: 4000,
                  position: 'bottom-right',
                  id: `empty-${room.id}`, // Prevent duplicates
                }
              );
            }
          }
        });
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [buildings, isSimulationRunning, automationMode]);

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '12px',
          padding: '16px',
        },
        success: {
          style: {
            background: '#10b981',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          style: {
            background: '#ef4444',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
      }}
    />
  );
};

export default NotificationSystem;

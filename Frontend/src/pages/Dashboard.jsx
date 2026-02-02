import { useSimulation } from '../context/SimulationContext';
import { Zap, Lightbulb, Wind, Thermometer, Users } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ModeSelector from '../components/dashboard/ModeSelector';
import RealTimeMetrics from '../components/dashboard/RealTimeMetrics';

const Dashboard = () => {
  const { 
    occupancy, 
    totalPowerConsumption, 
    automationMode,
    devices,
    temperature,
    timeOfDay 
  } = useSimulation();

  // Calculate energy savings compared to no automation (baseline: 1635W)
  const baselinePower = 1635;
  const savings = ((baselinePower - totalPowerConsumption) / baselinePower * 100).toFixed(1);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            System Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring and control of your smart building
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-8">
          <ModeSelector />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Current Power"
            value={`${totalPowerConsumption}W`}
            icon={<Zap className="text-yellow-500" size={24} />}
            trend={savings > 0 ? 'down' : 'up'}
            trendValue={`${Math.abs(savings)}%`}
          />
          
          <StatsCard
            title="Occupancy"
            value={occupancy}
            icon={<Users className="text-blue-500" size={24} />}
            subtitle="people in room"
          />
          
          <StatsCard
            title="Temperature"
            value={`${temperature}°C`}
            icon={<Thermometer className="text-red-500" size={24} />}
            subtitle={timeOfDay === 'day' ? 'Daytime' : 'Nighttime'}
          />
          
          <StatsCard
            title="Automation"
            value={
              automationMode === 'none' ? 'Off' :
              automationMode === 'rule-based' ? 'Rule-Based' :
              'Context-Aware'
            }
            icon={<Wind className="text-green-500" size={24} />}
            subtitle="Current mode"
          />
        </div>

        {/* Real-Time Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RealTimeMetrics />
          
          {/* Device Status */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={24} />
              Device Status
            </h2>
            <div className="space-y-4">
              {/* Light */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Lighting</h3>
                  <p className="text-sm text-gray-600">
                    {devices.light.isOn ? `${devices.light.intensity}% brightness` : 'Off'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    devices.light.isOn ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}>
                    <Lightbulb 
                      className={devices.light.isOn ? 'text-yellow-500' : 'text-gray-400'} 
                      size={24} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {devices.light.isOn ? devices.light.powerConsumption : 0}W
                  </p>
                </div>
              </div>

              {/* Fan */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Fan</h3>
                  <p className="text-sm text-gray-600">
                    {devices.fan.isOn ? 
                      `Speed ${devices.fan.speed}/3` : 
                      'Off'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    devices.fan.isOn ? 'bg-blue-100' : 'bg-gray-200'
                  }`}>
                    <Wind 
                      className={devices.fan.isOn ? 'text-blue-500' : 'text-gray-400'} 
                      size={24} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {devices.fan.isOn ? devices.fan.powerConsumption : 0}W
                  </p>
                </div>
              </div>

              {/* AC */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Air Conditioner</h3>
                  <p className="text-sm text-gray-600">
                    {devices.ac.isOn ? 
                      `${devices.ac.temperature}°C - Speed ${devices.ac.speed}/3` : 
                      'Off'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    devices.ac.isOn ? 'bg-cyan-100' : 'bg-gray-200'
                  }`}>
                    <Thermometer 
                      className={devices.ac.isOn ? 'text-cyan-500' : 'text-gray-400'} 
                      size={24} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {devices.ac.isOn ? devices.ac.powerConsumption : 0}W
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500">
            <h3 className="font-semibold text-red-700 mb-2">No Automation</h3>
            <p className="text-sm text-gray-700">
              All devices run at full capacity regardless of conditions
            </p>
            <p className="text-2xl font-bold text-red-600 mt-2">~1635W</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-700 mb-2">Rule-Based</h3>
            <p className="text-sm text-gray-700">
              Automated control using predefined rules and conditions
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-2">~600W</p>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-700 mb-2">Context-Aware</h3>
            <p className="text-sm text-gray-700">
              AI-powered optimization with predictive capabilities
            </p>
            <p className="text-2xl font-bold text-green-600 mt-2">~550W</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

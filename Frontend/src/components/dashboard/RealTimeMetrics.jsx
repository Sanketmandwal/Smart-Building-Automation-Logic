import { useSimulation } from '../../context/SimulationContext';
import { Activity, Sun, Moon, Droplets } from 'lucide-react';

const RealTimeMetrics = () => {
  const { 
    temperature, 
    humidity, 
    sunlightIntensity, 
    timeOfDay,
    totalPowerConsumption,
    occupancy 
  } = useSimulation();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-primary-600" size={24} />
        Real-Time Metrics
      </h2>

      <div className="space-y-4">
        {/* Time of Day */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {timeOfDay === 'day' ? (
              <Sun className="text-yellow-500" size={24} />
            ) : (
              <Moon className="text-indigo-500" size={24} />
            )}
            <div>
              <p className="text-sm text-gray-600">Time of Day</p>
              <p className="font-semibold capitalize">{timeOfDay}time</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Sunlight</p>
            <p className="font-semibold">{sunlightIntensity}%</p>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              temperature > 26 ? 'bg-red-100' : temperature > 22 ? 'bg-yellow-100' : 'bg-blue-100'
            }`}>
              <span className="text-xl">🌡️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Temperature</p>
              <p className="font-semibold">{temperature}°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-medium ${
              temperature > 26 ? 'text-red-600' : temperature > 22 ? 'text-yellow-600' : 'text-blue-600'
            }`}>
              {temperature > 26 ? 'Hot' : temperature > 22 ? 'Warm' : 'Cool'}
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <Droplets className="text-cyan-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="font-semibold">{humidity}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs font-medium ${
              humidity > 70 ? 'text-cyan-700' : 'text-gray-600'
            }`}>
              {humidity > 70 ? 'High' : humidity > 40 ? 'Normal' : 'Low'}
            </p>
          </div>
        </div>

        {/* Occupancy Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupancy</p>
              <p className="font-semibold">{occupancy} {occupancy === 1 ? 'Person' : 'People'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              occupancy > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {occupancy > 0 ? 'Occupied' : 'Empty'}
            </div>
          </div>
        </div>

        {/* Power Consumption Bar */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Current Power Draw</p>
            <p className="text-lg font-bold text-gray-800">{totalPowerConsumption}W</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                totalPowerConsumption > 1200 ? 'bg-red-500' :
                totalPowerConsumption > 600 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min((totalPowerConsumption / 1635) * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0W</span>
            <span>1635W (Max)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;

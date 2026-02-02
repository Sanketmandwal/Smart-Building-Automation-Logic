import { useSimulation } from '../../context/SimulationContext';
import { Sun, Moon, Thermometer } from 'lucide-react';

const EnvironmentControls = () => {
  const { 
    timeOfDay, 
    setTimeOfDay, 
    temperature, 
    setTemperature,
    sunlightIntensity,
    setSunlightIntensity
  } = useSimulation();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Environment Controls</h2>

      {/* Time of Day Toggle */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time of Day
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeOfDay('day')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              timeOfDay === 'day'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Sun size={20} />
            Day
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              timeOfDay === 'night'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Moon size={20} />
            Night
          </button>
        </div>
      </div>

      {/* Sunlight Intensity Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sunlight Intensity
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="100"
            value={sunlightIntensity}
            onChange={(e) => setSunlightIntensity(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-sm font-semibold text-gray-800 w-12 text-right">
            {sunlightIntensity}%
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Thermometer size={16} />
          Room Temperature
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="16"
            max="35"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
          <span className="text-sm font-semibold text-gray-800 w-12 text-right">
            {temperature}°C
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>16°C</span>
          <span>35°C</span>
        </div>
      </div>

      {/* Temperature Status */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Temperature Status:</span>
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
            temperature > 28 ? 'bg-red-100 text-red-700' :
            temperature > 24 ? 'bg-yellow-100 text-yellow-700' :
            temperature > 20 ? 'bg-green-100 text-green-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {temperature > 28 ? '🔥 Very Hot' :
             temperature > 24 ? '☀️ Warm' :
             temperature > 20 ? '✅ Comfortable' :
             '❄️ Cool'}
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Tip:</strong> Adjust these settings to see how the automation responds to different environmental conditions!
        </p>
      </div>
    </div>
  );
};

export default EnvironmentControls;

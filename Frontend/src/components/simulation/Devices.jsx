import { motion } from 'framer-motion';
import { Lightbulb, Wind, Thermometer } from 'lucide-react';

const Devices = ({ devices, timeOfDay }) => {
  return (
    <div className="space-y-3">
      {/* Light Bulb */}
      <motion.div
        animate={{
          opacity: devices.light.isOn ? 1 : 0.3,
          scale: devices.light.isOn ? [1, 1.1, 1] : 1
        }}
        transition={{ duration: 0.5 }}
        className={`p-3 rounded-lg ${
          timeOfDay === 'day' ? 'bg-white' : 'bg-gray-800'
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            devices.light.isOn ? 'bg-yellow-100' : 'bg-gray-200'
          }`}>
            <Lightbulb 
              className={devices.light.isOn ? 'text-yellow-500' : 'text-gray-400'} 
              size={20}
              fill={devices.light.isOn ? 'currentColor' : 'none'}
            />
          </div>
          <div>
            <p className={`text-xs font-semibold ${
              timeOfDay === 'day' ? 'text-gray-700' : 'text-white'
            }`}>
              Light
            </p>
            <p className={`text-xs ${
              timeOfDay === 'day' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {devices.light.isOn ? `${devices.light.intensity}%` : 'Off'}
            </p>
          </div>
        </div>
        {devices.light.isOn && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${devices.light.intensity}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </motion.div>

      {/* Fan */}
      <motion.div
        animate={{
          opacity: devices.fan.isOn ? 1 : 0.3
        }}
        transition={{ duration: 0.5 }}
        className={`p-3 rounded-lg ${
          timeOfDay === 'day' ? 'bg-white' : 'bg-gray-800'
        } shadow-lg`}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            devices.fan.isOn ? 'bg-blue-100' : 'bg-gray-200'
          }`}>
            <motion.div
              animate={{
                rotate: devices.fan.isOn ? 360 : 0
              }}
              transition={{
                duration: devices.fan.speed === 3 ? 0.5 : devices.fan.speed === 2 ? 1 : 2,
                repeat: devices.fan.isOn ? Infinity : 0,
                ease: 'linear'
              }}
            >
              <Wind 
                className={devices.fan.isOn ? 'text-blue-500' : 'text-gray-400'} 
                size={20}
              />
            </motion.div>
          </div>
          <div>
            <p className={`text-xs font-semibold ${
              timeOfDay === 'day' ? 'text-gray-700' : 'text-white'
            }`}>
              Fan
            </p>
            <p className={`text-xs ${
              timeOfDay === 'day' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {devices.fan.isOn ? `Speed ${devices.fan.speed}` : 'Off'}
            </p>
          </div>
        </div>
        {devices.fan.isOn && (
          <div className="flex gap-1">
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                className={`flex-1 h-1.5 rounded-full ${
                  level <= devices.fan.speed ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* AC with better speed visualization */}
<motion.div
  animate={{
    opacity: devices.ac.isOn ? 1 : 0.5
  }}
  className={`p-3 rounded-lg ${
    timeOfDay === 'day' ? 'bg-white' : 'bg-gray-800'
  } shadow-lg`}
>
  <div className="flex items-center gap-2 mb-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
      devices.ac.isOn 
        ? (devices.ac.mode === 'cooling' ? 'bg-cyan-500' : 'bg-red-500')
        : 'bg-gray-400'
    }`}>
      {devices.ac.mode === 'cooling' ? (
        <Snowflake size={20} className="text-white" />
      ) : devices.ac.mode === 'heating' ? (
        <Flame size={20} className="text-white" />
      ) : (
        <Thermometer size={20} className="text-gray-600" />
      )}
    </div>
    <div className="flex-1">
      <p className={`text-xs font-semibold ${
        timeOfDay === 'day' ? 'text-gray-700' : 'text-white'
      }`}>
        AC {devices.ac.mode === 'cooling' ? '❄️' : devices.ac.mode === 'heating' ? '🔥' : ''}
      </p>
      <p className={`text-xs ${
        timeOfDay === 'day' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        {devices.ac.isOn 
          ? `${devices.ac.temperature}°C • Speed ${devices.ac.speed}/3` 
          : 'Off'
        }
      </p>
    </div>
  </div>
  
  {/* Speed bars with labels */}
  {devices.ac.isOn && (
    <div className="space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div key={level} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-full h-2 rounded-full transition-all ${
                level <= devices.ac.speed 
                  ? (devices.ac.mode === 'cooling' ? 'bg-cyan-500' : 'bg-red-500')
                  : 'bg-gray-200'
              }`}
            />
            <span className="text-[8px] text-gray-500">{level}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-gray-500 mt-1">
        {devices.ac.powerConsumption}W
      </p>
    </div>
  )}
</motion.div>

    </div>
  );
};

export default Devices;

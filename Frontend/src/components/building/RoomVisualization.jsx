import { motion } from 'framer-motion';
import { Lightbulb, Wind, Snowflake, Flame } from 'lucide-react';

const RoomVisualization = ({ room, building }) => {
  const { devices } = room;
  const roomBrightness = devices.light.isOn ? devices.light.intensity : 0;
  const lightOpacity = roomBrightness / 100;

  // ✅ FIXED: Simple black when off, yellow when on
  const getRoomBackground = () => {
    if (!devices.light.isOn || roomBrightness === 0) {
      return 'from-gray-900 via-gray-800 to-black'; // DARK/BLACK when OFF
    } else if (roomBrightness < 30) {
      return 'from-gray-700 via-gray-600 to-gray-800'; // DIM
    } else if (roomBrightness < 60) {
      return 'from-amber-200 via-yellow-100 to-orange-100'; // MEDIUM YELLOW
    } else {
      return 'from-yellow-100 via-amber-50 to-yellow-50'; // BRIGHT YELLOW
    }
  };

  return (
    <div
      className={`relative rounded-xl border-4 border-gray-400 transition-all duration-700 overflow-hidden min-h-[400px] bg-gradient-to-b ${getRoomBackground()}`}
    >
      {/* ✅ BRIGHT YELLOW LIGHT OVERLAY when ON */}
      {devices.light.isOn && roomBrightness > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: lightOpacity }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `radial-gradient(ellipse 90% 70% at 50% 10%, 
              rgba(255, 255, 150, ${lightOpacity * 0.9}), 
              rgba(255, 230, 100, ${lightOpacity * 0.6}) 40%, 
              rgba(255, 200, 50, ${lightOpacity * 0.3}) 60%,
              transparent 80%)`
          }}
        />
      )}

      {/* Ceiling Light Bulb */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          animate={{ 
            scale: devices.light.isOn ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            duration: 2, 
            repeat: devices.light.isOn ? Infinity : 0,
            ease: "easeInOut" 
          }}
        >
          {/* ✅ BULB: BLACK when OFF, BRIGHT YELLOW when ON */}
          <div
            className={`w-20 h-24 rounded-b-full border-4 flex items-center justify-center transition-all duration-500 ${
              devices.light.isOn 
                ? 'bg-yellow-400 border-yellow-600' 
                : 'bg-gray-800 border-gray-900'
            }`}
            style={{
              boxShadow: devices.light.isOn
                ? `0 0 ${roomBrightness}px rgba(255, 255, 0, 1), 
                   0 0 ${roomBrightness * 2}px rgba(255, 220, 0, 0.8),
                   0 ${roomBrightness * 0.5}px ${roomBrightness}px rgba(255, 255, 100, 0.6)`
                : 'inset 0 4px 8px rgba(0,0,0,0.5)'
            }}
          >
            <Lightbulb
              className={devices.light.isOn ? 'text-yellow-800' : 'text-gray-600'}
              size={32}
              fill={devices.light.isOn ? 'currentColor' : 'none'}
              strokeWidth={devices.light.isOn ? 1 : 2}
            />
          </div>
          
          {/* ✅ LIGHT BEAM when ON */}
          {devices.light.isOn && roomBrightness > 20 && (
            <motion.div
              className="absolute top-full left-1/2 transform -translate-x-1/2 pointer-events-none"
              animate={{ opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: `${120 + roomBrightness * 2}px`,
                height: '350px',
                backgroundImage: `linear-gradient(to bottom, 
                  rgba(255, 255, 150, ${lightOpacity * 0.8}), 
                  rgba(255, 255, 100, ${lightOpacity * 0.5}) 40%, 
                  rgba(255, 230, 80, ${lightOpacity * 0.3}) 70%,
                  transparent)`,
                clipPath: 'polygon(45% 0%, 55% 0%, 90% 100%, 10% 100%)',
                filter: 'blur(8px)'
              }}
            />
          )}
        </motion.div>
        
        {/* Intensity Label */}
        {devices.light.isOn && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg"
          >
            💡 {roomBrightness}% BRIGHT
          </motion.div>
        )}
        
        {!devices.light.isOn && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
            💡 OFF
          </div>
        )}
      </div>

      {/* Wall AC Unit */}
      <div className="absolute top-20 right-8 z-20">
        <motion.div
          animate={{ 
            scale: devices.ac.isOn ? [1, 1.03, 1] : 1,
          }}
          transition={{ duration: 1.5, repeat: devices.ac.isOn ? Infinity : 0 }}
        >
          <div className={`w-32 h-24 rounded-xl border-4 shadow-xl flex items-center justify-center transition-all ${
            devices.ac.isOn 
              ? devices.ac.mode === 'cooling' 
                ? 'bg-cyan-100 border-cyan-500' 
                : 'bg-red-100 border-red-500'
              : 'bg-gray-700 border-gray-800'
          }`}>
            {devices.ac.isOn ? (
              devices.ac.mode === 'cooling' ? (
                <Snowflake className="text-cyan-600" size={40} />
              ) : (
                <Flame className="text-red-600" size={40} />
              )
            ) : (
              <Snowflake className="text-gray-500" size={40} />
            )}
          </div>
        </motion.div>
        
        {/* AC airflow effect */}
        {devices.ac.isOn && (
          <>
            {[0, 0.3, 0.6].map((delay, i) => (
              <motion.div
                key={i}
                className="absolute left-0 top-1/2 transform -translate-y-1/2"
                animate={{ x: [-10, -70], opacity: [0.9, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay, ease: 'linear' }}
              >
                <div className={`w-8 h-1.5 rounded-full ${
                  devices.ac.mode === 'cooling' ? 'bg-cyan-400' : 'bg-red-400'
                }`} style={{ marginTop: i * 8 }} />
              </motion.div>
            ))}
          </>
        )}
        
        {/* AC Status Label */}
        {devices.ac.isOn && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 ${
              devices.ac.mode === 'cooling' ? 'bg-cyan-500' : 'bg-red-500'
            } text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg`}
          >
            {devices.ac.mode === 'cooling' ? '❄️' : '🔥'} {devices.ac.temperature}°C • Speed {devices.ac.speed}
          </motion.div>
        )}
      </div>

      {/* Standing Fan */}
      <div className="absolute top-28 left-8 z-20">
        <div className="relative">
          {/* Fan base */}
          <div className={`w-4 h-24 mx-auto mb-1 rounded transition-colors ${
            devices.fan.isOn ? 'bg-gray-700' : 'bg-gray-800'
          }`}></div>
          
          {/* Fan blades */}
          <motion.div
            animate={{ 
              rotateZ: devices.fan.isOn ? 360 : 0 
            }}
            transition={{
              duration: devices.fan.speed === 3 ? 0.4 : devices.fan.speed === 2 ? 0.7 : 1.2,
              repeat: devices.fan.isOn ? Infinity : 0,
              ease: 'linear'
            }}
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-lg transition-all ${
              devices.fan.isOn 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-gray-700 border-gray-800'
            }`}
          >
            <Wind 
              className={devices.fan.isOn ? 'text-blue-600' : 'text-gray-500'} 
              size={44} 
            />
          </motion.div>

          {/* Wind effect */}
          {devices.fan.isOn && (
            <>
              {[0, 0.12, 0.24].map((delay, i) => (
                <motion.div
                  key={i}
                  className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4"
                  animate={{ x: [0, 50], opacity: [0.8, 0] }}
                  transition={{ 
                    duration: 1 / devices.fan.speed, 
                    repeat: Infinity,
                    delay,
                    ease: 'linear' 
                  }}
                >
                  <div className="text-blue-400 text-4xl font-bold">~</div>
                </motion.div>
              ))}
            </>
          )}
          
          {/* Fan Status Label */}
          {devices.fan.isOn && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg"
            >
              💨 Speed {devices.fan.speed}
            </motion.div>
          )}
        </div>
      </div>

      {/* People in Room */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-6 z-20">
        {room.people && room.people.length > 0 ? (
          room.people.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ scale: 0, y: -30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: -30 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="relative"
            >
              <div className="text-7xl filter drop-shadow-2xl" title={person.name}>
                🧑
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap">
                {person.name}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-medium px-6 py-3 rounded-full shadow-lg ${
              devices.light.isOn 
                ? 'text-gray-700 bg-white/90' 
                : 'text-gray-300 bg-gray-800/90'
            }`}
          >
            🚪 Room is empty
          </motion.div>
        )}
      </div>

      {/* Temperature Display */}
      <div className={`absolute top-4 right-4 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-20 border-2 transition-colors ${
        devices.light.isOn 
          ? 'bg-white/95 border-red-300' 
          : 'bg-gray-800/95 border-gray-700'
      }`}>
        <div className={`text-xs font-medium ${devices.light.isOn ? 'text-gray-600' : 'text-gray-400'}`}>Temperature</div>
        <div className={`text-3xl font-bold flex items-center gap-1 ${devices.light.isOn ? 'text-red-600' : 'text-red-400'}`}>
          🌡️ {room.temperature}°C
        </div>
      </div>

      {/* Power Display */}
      <div className={`absolute top-4 left-4 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg z-20 border-2 transition-colors ${
        devices.light.isOn 
          ? 'bg-white/95 border-yellow-300' 
          : 'bg-gray-800/95 border-gray-700'
      }`}>
        <div className={`text-xs font-medium ${devices.light.isOn ? 'text-gray-600' : 'text-gray-400'}`}>Power Usage</div>
        <div className={`text-3xl font-bold flex items-center gap-1 ${devices.light.isOn ? 'text-yellow-600' : 'text-yellow-400'}`}>
          ⚡ {(room.devices.light.powerConsumption || 0) + 
           (room.devices.fan.powerConsumption || 0) + 
           (room.devices.ac.powerConsumption || 0) +
           (room.equipmentPower || 0)}W
        </div>
      </div>

      {/* Floor */}
      <div className={`absolute bottom-0 left-0 right-0 h-24 border-t-4 z-[5] transition-colors ${
        devices.light.isOn 
          ? 'bg-gradient-to-t from-amber-400 via-amber-300 to-amber-200 border-amber-500'
          : 'bg-gradient-to-t from-gray-800 via-gray-700 to-gray-600 border-gray-900'
      }`}></div>

      {/* Room Type Badge */}
      <div className="absolute bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl z-20 flex items-center gap-2">
        <span className="text-xl">
          {room.type === 'conference' ? '👥' : 
           room.type === 'lab' ? '💻' : 
           room.type === 'server' ? '🖥️' : 
           room.type === 'cafeteria' ? '🍽️' : 
           room.type === 'office' ? '📋' : 
           room.type === 'library' ? '📚' : 
           room.type === 'reception' ? '🏢' : '📦'}
        </span>
        {room.type.toUpperCase()}
      </div>
    </div>
  );
};

export default RoomVisualization;

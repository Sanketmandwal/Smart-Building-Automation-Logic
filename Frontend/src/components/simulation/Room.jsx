import { useSimulation } from '../../context/SimulationContext';
import Person from './Person';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Wind, Snowflake, Flame } from 'lucide-react';

const Room = () => {
  const {
    peopleOutside,
    peopleInside,
    movePerson,
    timeOfDay,
    devices,
    isSimulationRunning
  } = useSimulation();

  // Calculate room brightness based on light intensity
  const roomBrightness = devices.light.isOn ? devices.light.intensity : 0;
  const lightOpacity = roomBrightness / 100;

  return (
    <div className="card min-h-[700px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Room Visualization</h2>
        {isSimulationRunning && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Outside Area */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-400">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>🚪</span>
            Outside Room ({peopleOutside.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {peopleOutside.length > 0 ? (
              peopleOutside.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Person
                    person={person}
                    onClick={() => movePerson(person.id, true)}
                    location="outside"
                  />
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Everyone is inside</p>
            )}
          </div>
        </div>

        {/* 3D REALISTIC ROOM */}
        <div
          className={`relative rounded-xl border-4 transition-all duration-700 overflow-hidden ${timeOfDay === 'day'
            ? 'bg-gradient-to-b from-sky-100 via-amber-50 to-orange-100 border-amber-300'
            : 'bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-900 border-indigo-700'
            }`}
          style={{
            minHeight: '550px',
            boxShadow: timeOfDay === 'day'
              ? 'inset 0 10px 60px rgba(255, 200, 100, 0.3)'
              : 'inset 0 10px 60px rgba(0, 0, 50, 0.8)'
          }}
        >
          {/* ROOM LIGHTING OVERLAY - This makes the room actually brighter! */}
{devices.light.isOn && (
  <motion.div
    className="absolute inset-0 pointer-events-none z-10"
    animate={{
      opacity: lightOpacity * 0.6
    }}
    transition={{ duration: 0.5 }}
    style={{
      background: `radial-gradient(ellipse at 50% 15%, rgba(255, 255, 200, ${lightOpacity * 0.8}), transparent 60%)`
    }}
  />
)}


          {/* Ceiling */}
          <div className={`absolute top-0 left-0 right-0 h-24 transition-colors duration-500 ${timeOfDay === 'day' ? 'bg-gray-100' : 'bg-gray-800'
            }`}
            style={{
              clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
            {/* Ceiling Light Fixture */}
            <div className="absolute  left-1/2 transform -translate-x-1/2 z-20">
              <motion.div
                animate={{
                  opacity: devices.light.isOn ? 1 : 0.3,
                  scale: devices.light.isOn ? [1, 1.05, 1] : 1
                }}
                transition={{ duration: 2, repeat: devices.light.isOn ? Infinity : 0, repeatDelay: 1 }}
                className="relative"
              >
                {/* Light bulb */}
                {/* Light bulb - changes color based on on/off state */}
                <div className={`w-16 h-20 rounded-b-full border-4 border-gray-400 relative transition-all duration-500 ${devices.light.isOn
                  ? 'bg-yellow-200'
                  : timeOfDay === 'day'
                    ? 'bg-gray-400'  // Dark gray during day when off
                    : 'bg-gray-600'  // Darker at night when off
                  }`}
                  style={{
                    boxShadow: devices.light.isOn
                      ? `0 0 ${devices.light.intensity * 1.5}px rgba(255, 230, 0, ${lightOpacity})`
                      : 'inset 0 4px 8px rgba(0,0,0,0.3)',  // Inner shadow when off
                    filter: devices.light.isOn ? `brightness(${1 + lightOpacity})` : 'brightness(0.7)'
                  }}>
                  <Lightbulb
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all ${devices.light.isOn ? 'text-yellow-500' : 'text-gray-600'
                      }`}
                    size={32}
                    fill={devices.light.isOn ? 'currentColor' : 'none'}
                  />

                  {/* Show "OFF" text when light is off */}
                  {!devices.light.isOn && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-gray-700">
                      OFF
                    </div>
                  )}
                </div>


                {/* Light rays effect */}
                {devices.light.isOn && (
                  <>
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2"
                      style={{
                        width: `${100 + devices.light.intensity * 2}px`,
                        height: `${200 + devices.light.intensity * 3}px`,
                        background: `radial-gradient(ellipse at top, rgba(255, 255, 200, ${lightOpacity * 0.4}) 0%, rgba(255, 255, 150, ${lightOpacity * 0.2}) 30%, transparent 70%)`,
                      }}
                      animate={{
                        opacity: [0.6, 0.9, 0.6]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Bright center glow */}
                    <motion.div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: `${80 + devices.light.intensity}px`,
                        height: `${80 + devices.light.intensity}px`,
                        background: `radial-gradient(circle, rgba(255, 255, 230, ${lightOpacity * 0.8}) 0%, rgba(255, 255, 200, ${lightOpacity * 0.4}) 40%, transparent 70%)`,
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </>
                )}
              </motion.div>

              {/* Intensity indicator */}
              {/* Intensity indicator */}
              <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded whitespace-nowrap z-30 ${devices.light.isOn
                  ? 'bg-black/70 text-white'
                  : 'bg-gray-300 text-gray-600'
                }`}>
                {devices.light.isOn ? `💡 ${devices.light.intensity}%` : '💡 OFF'}
              </div>

            </div>
          </div>

          {/* Wall-mounted AC Unit */}
          <div className="absolute top-28 right-8 z-20">
            <motion.div
              animate={{
                opacity: devices.ac.isOn ? 1 : 0.5
              }}
              className={`w-36 h-24 rounded-lg border-4 border-gray-400 shadow-2xl relative overflow-hidden ${timeOfDay === 'day' ? 'bg-white' : 'bg-gray-700'
                }`}
            >
              {/* AC Vents with speed indicators */}
              <div className="absolute inset-2 flex flex-col gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    className={`h-2 rounded ${timeOfDay === 'day' ? 'bg-gray-300' : 'bg-gray-600'
                      }`}
                    animate={{
                      opacity: devices.ac.isOn && i <= devices.ac.speed ? [0.5, 1, 0.5] : 0.3
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: devices.ac.isOn ? Infinity : 0,
                      delay: i * 0.1
                    }}
                  ></motion.div>
                ))}
              </div>

              {/* AC Icon with mode */}
              <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${devices.ac.isOn ? (devices.ac.mode === 'cooling' ? 'bg-cyan-500' : 'bg-red-500') : 'bg-gray-400'
                }`}>
                {devices.ac.mode === 'cooling' ? (
                  <Snowflake size={16} className="text-white" />
                ) : devices.ac.mode === 'heating' ? (
                  <Flame size={16} className="text-white" />
                ) : null}
              </div>

              {/* Speed indicator bars */}
              <div className="absolute bottom-2 left-2 flex gap-1">
                {[1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`w-2 h-${level * 2} rounded-full transition-all ${devices.ac.isOn && level <= devices.ac.speed ? 'bg-cyan-500' : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>

              {/* Cool/Hot air animation */}
              {devices.ac.isOn && (
                <AnimatePresence>
                  {[...Array(devices.ac.speed * 3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full ${devices.ac.mode === 'cooling' ? 'bg-cyan-300' : 'bg-red-300'
                        }`}
                      initial={{ opacity: 1, y: 0, x: 0 }}
                      animate={{
                        y: [0, 120],
                        x: [0, (Math.random() - 0.5) * 80],
                        opacity: [1, 0],
                        scale: [1, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeOut'
                      }}
                    />
                  ))}
                </AnimatePresence>
              )}

              {/* Status display */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {devices.ac.isOn ? `❄️ ${devices.ac.temperature}°C - Speed ${devices.ac.speed}/3` : '❌ Off'}
              </div>
            </motion.div>
          </div>

          {/* Standing Fan */}
          <div className="absolute top-32 left-8 z-20">
            <motion.div className="relative">
              {/* Fan base */}
              <div className={`w-16 h-4 rounded-full shadow-lg ${timeOfDay === 'day' ? 'bg-gray-300' : 'bg-gray-700'
                }`}></div>

              {/* Fan stand */}
              <div className={`w-2 h-24 mx-auto rounded ${timeOfDay === 'day' ? 'bg-gray-400' : 'bg-gray-600'
                }`}></div>

              {/* Fan head */}
              <motion.div
                animate={{
                  rotateZ: devices.fan.isOn ? 360 : 0
                }}
                transition={{
                  duration: devices.fan.speed === 3 ? 0.3 : devices.fan.speed === 2 ? 0.6 : devices.fan.speed === 1 ? 1.2 : 0,
                  repeat: devices.fan.isOn ? Infinity : 0,
                  ease: 'linear'
                }}
                className={`w-20 h-20 rounded-full border-4 relative -mt-16 ${devices.fan.isOn ? 'bg-blue-200/40 border-blue-400' : 'bg-gray-300/40 border-gray-400'
                  }`}
                style={{
                  filter: devices.fan.isOn ? `blur(${devices.fan.speed}px)` : 'none'
                }}
              >
                {/* Fan blades */}
                {[0, 120, 240].map((rotation) => (
                  <div
                    key={rotation}
                    className={`absolute w-1 h-8 left-1/2 top-1/2 origin-bottom ${devices.fan.isOn ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                    style={{
                      transform: `translate(-50%, -100%) rotate(${rotation}deg)`
                    }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${devices.fan.isOn ? 'bg-blue-600' : 'bg-gray-500'
                    }`}></div>
                </div>
              </motion.div>

              {/* Wind effect */}
              {devices.fan.isOn && (
                <div className="absolute top-0 left-full ml-2">
                  {[...Array(devices.fan.speed * 2)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0.6, x: 0 }}
                      animate={{
                        x: [0, 40],
                        opacity: [0.6, 0]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    >
                      <Wind size={16} className="text-blue-400" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Fan status */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {devices.fan.isOn ? `💨 Speed ${devices.fan.speed}/3` : '❌ Off'}
              </div>
            </motion.div>
          </div>

          {/* People Inside */}
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex flex-wrap gap-4 justify-center items-center z-20">
            {peopleInside.length > 0 ? (
              peopleInside.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ scale: 0, opacity: 0, y: -50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Person
                    person={person}
                    onClick={() => movePerson(person.id, false)}
                    location="inside"
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <p className="text-4xl mb-2">🚶‍♂️</p>
                <p className={`text-sm italic ${timeOfDay === 'day' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                  Room is empty
                </p>
              </motion.div>
            )}
          </div>

          {/* Floor */}
          <div className={`absolute bottom-0 left-0 right-0 h-20 ${timeOfDay === 'day' ? 'bg-amber-100' : 'bg-gray-800'
            }`}
            style={{
              clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)',
              backgroundImage: timeOfDay === 'day'
                ? 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(139, 69, 19, 0.1) 50px, rgba(139, 69, 19, 0.1) 51px)'
                : 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255, 255, 255, 0.05) 50px, rgba(255, 255, 255, 0.05) 51px)'
            }}></div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click on people to move them and watch devices respond dynamically! Light intensity changes based on occupancy and time!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Room;

import { useSimulation } from '../../context/SimulationContext';
import Person from './Person';
import Devices from './Devices';
import { motion } from 'framer-motion';

const Room = () => {
  const { 
    peopleOutside, 
    peopleInside, 
    movePerson, 
    timeOfDay,
    devices 
  } = useSimulation();

  return (
    <div className="card min-h-[600px]">
      <h2 className="text-xl font-semibold mb-4">Room Visualization</h2>
      
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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

        {/* Room Interior */}
        <div 
          className={`relative p-6 rounded-xl border-4 transition-all duration-500 ${
            timeOfDay === 'day' 
              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300' 
              : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-600'
          }`}
          style={{ minHeight: '400px' }}
        >
          {/* Room Label */}
          <div className="absolute top-4 left-4">
            <h3 className={`text-lg font-bold ${
              timeOfDay === 'day' ? 'text-gray-800' : 'text-white'
            }`}>
              Smart Room
            </h3>
            <p className={`text-sm ${
              timeOfDay === 'day' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {peopleInside.length} {peopleInside.length === 1 ? 'person' : 'people'} inside
            </p>
          </div>

          {/* Devices Display */}
          <div className="absolute top-4 right-4">
            <Devices devices={devices} timeOfDay={timeOfDay} />
          </div>

          {/* People Inside */}
          <div className="mt-20 flex flex-wrap gap-4 justify-center items-center">
            {peopleInside.length > 0 ? (
              peopleInside.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ scale: 0, opacity: 0, y: -50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 50 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
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
                className="text-center py-20"
              >
                <p className={`text-2xl mb-2 ${
                  timeOfDay === 'day' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  🚶‍♂️
                </p>
                <p className={`text-sm italic ${
                  timeOfDay === 'day' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Room is empty. Click people outside to bring them in.
                </p>
              </motion.div>
            )}
          </div>

          {/* Floor Grid Pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-20 opacity-10">
            <div className={`w-full h-full ${
              timeOfDay === 'day' ? 'bg-gray-400' : 'bg-white'
            }`} 
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 10px,
                currentColor 10px,
                currentColor 11px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 10px,
                currentColor 10px,
                currentColor 11px
              )`
            }}></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click on people to move them in/out of the room and watch the automation respond!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Room;

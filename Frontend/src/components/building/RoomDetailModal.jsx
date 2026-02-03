import { useState, useEffect } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Thermometer, Droplets, Users, Zap } from 'lucide-react';
import RoomVisualization from './RoomVisualization';

const RoomDetailModal = ({ buildingId, roomId, onClose }) => {
  const { buildings, ROOM_TYPES, movePerson, updateRoomTemperature, calculateRoomPower } = useBuildingContext();
  
  // ✅ FIX: Get live room data (re-renders when buildings change)
  const building = buildings.find(b => b.id === buildingId);
  const room = building?.rooms.find(r => r.id === roomId);
  
  if (!room || !building) return null;

  const roomConfig = ROOM_TYPES[room.type];
  const roomPower = calculateRoomPower(room);

  // Available people to add (mock)
  const [availablePeople] = useState([
    { id: 'p1', name: 'Person 1' },
    { id: 'p2', name: 'Person 2' },
    { id: 'p3', name: 'Person 3' },
    { id: 'p4', name: 'Person 4' },
    { id: 'p5', name: 'Person 5' },
  ]);

  const peopleOutside = availablePeople.filter(
    p => !room.people.find(rp => rp.id === p.id)
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r from-${building.color}-500 to-${building.color}-600 text-white p-6 sticky top-0 z-10`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{roomConfig?.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold">{room.name}</h2>
                  <p className={`text-${building.color}-100`}>{roomConfig?.name} • {building.name}</p>
                  <p className="text-sm text-${building.color}-200 mt-1">{roomConfig?.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-yellow-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Power</span>
                </div>
                <p className="text-3xl font-bold text-yellow-700">{roomPower}W</p>
              </div>

              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="text-blue-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Occupancy</span>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {room.occupancy}/{roomConfig?.maxOccupancy}
                </p>
              </div>

              <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-300">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="text-red-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Temperature</span>
                </div>
                <p className="text-3xl font-bold text-red-700">{room.temperature}°C</p>
              </div>

              <div className="card bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="text-cyan-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">Humidity</span>
                </div>
                <p className="text-3xl font-bold text-cyan-700">{room.humidity}%</p>
              </div>
            </div>

            {/* Room Visualization */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Room Visualization</h3>
              <RoomVisualization room={room} building={building} />
            </div>

            {/* People Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* People Outside */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  🚪 Available People ({peopleOutside.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {peopleOutside.length > 0 ? (
                    peopleOutside.map(person => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <span className="font-medium text-gray-700">{person.name}</span>
                        <button
                          onClick={() => movePerson(buildingId, roomId, person, true)}
                          disabled={room.occupancy >= roomConfig?.maxOccupancy}
                          className="btn-primary py-1 px-3 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">All people are in the room</p>
                  )}
                </div>
              </div>

              {/* People Inside */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  👥 Inside Room ({room.people.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {room.people.length > 0 ? (
                    room.people.map(person => (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 bg-green-100 rounded-lg"
                      >
                        <span className="font-medium text-gray-700">
                          {person.name}
                          {person.fixed && <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Fixed</span>}
                        </span>
                        {!person.fixed && (
                          <button
                            onClick={() => movePerson(buildingId, roomId, person.id, false)}
                            className="btn-secondary py-1 px-3 text-sm flex items-center gap-1"
                          >
                            <Minus size={16} />
                            Remove
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">Room is empty</p>
                  )}
                </div>
              </div>
            </div>

            {/* Temperature Control */}
            <div className="card bg-gradient-to-br from-orange-50 to-red-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🌡️ Temperature Control
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="16"
                  max="35"
                  value={room.temperature}
                  onChange={(e) => updateRoomTemperature(buildingId, roomId, Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-blue-300 via-green-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-3xl font-bold text-gray-800 w-20 text-right">
                  {room.temperature}°C
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>16°C (Cold)</span>
                <span>35°C (Hot)</span>
              </div>
            </div>

            {/* Device Status - LIVE UPDATES */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Device Status (Live)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Light */}
                <div className={`p-4 rounded-lg border-2 transition-all ${room.devices.light.isOn ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="text-3xl mb-2">💡</div>
                  <h4 className="font-semibold mb-1">Lighting</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {room.devices.light.isOn ? `${room.devices.light.intensity}% brightness` : 'Off'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {room.devices.light.powerConsumption}W
                  </p>
                  {/* Visual indicator */}
                  {room.devices.light.isOn && (
                    <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-yellow-500 h-full transition-all duration-500"
                        style={{ width: `${room.devices.light.intensity}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Fan */}
                <div className={`p-4 rounded-lg border-2 transition-all ${room.devices.fan.isOn ? 'bg-blue-50 border-blue-400' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="text-3xl mb-2">💨</div>
                  <h4 className="font-semibold mb-1">Fan</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {room.devices.fan.isOn ? `Speed ${room.devices.fan.speed}/3` : 'Off'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {room.devices.fan.powerConsumption}W
                  </p>
                  {/* Visual speed indicator */}
                  {room.devices.fan.isOn && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map(level => (
                        <div 
                          key={level}
                          className={`flex-1 h-2 rounded ${level <= room.devices.fan.speed ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* AC */}
                <div className={`p-4 rounded-lg border-2 transition-all ${room.devices.ac.isOn ? 'bg-cyan-50 border-cyan-400' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="text-3xl mb-2">❄️</div>
                  <h4 className="font-semibold mb-1">Air Conditioner</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {room.devices.ac.isOn ? `${room.devices.ac.temperature}°C • Speed ${room.devices.ac.speed}/3` : 'Off'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {room.devices.ac.powerConsumption}W
                  </p>
                  {/* Visual speed indicator */}
                  {room.devices.ac.isOn && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3].map(level => (
                        <div 
                          key={level}
                          className={`flex-1 h-2 rounded ${level <= room.devices.ac.speed ? 'bg-cyan-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Live Update Indicator */}
            <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Device states update automatically every 5 seconds</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoomDetailModal;

import { useBuildingContext } from '../../context/BuildingContext';
import { Map, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const OccupancyHeatmap = () => {
  const { buildings, ROOM_TYPES } = useBuildingContext();

  // Get heatmap color based on occupancy percentage
  const getHeatColor = (occupancy, maxOccupancy) => {
    const percentage = (occupancy / maxOccupancy) * 100;
    
    if (percentage === 0) return 'bg-gray-200 border-gray-300 text-gray-600';
    if (percentage <= 25) return 'bg-green-200 border-green-400 text-green-800';
    if (percentage <= 50) return 'bg-yellow-200 border-yellow-400 text-yellow-800';
    if (percentage <= 75) return 'bg-orange-200 border-orange-400 text-orange-800';
    if (percentage <= 100) return 'bg-red-300 border-red-500 text-red-900';
    return 'bg-purple-400 border-purple-600 text-purple-900'; // Overcrowded
  };

  const getOccupancyLabel = (occupancy, maxOccupancy) => {
    const percentage = (occupancy / maxOccupancy) * 100;
    
    if (percentage === 0) return 'Empty';
    if (percentage <= 25) return 'Low';
    if (percentage <= 50) return 'Medium';
    if (percentage <= 75) return 'High';
    if (percentage <= 100) return 'Full';
    return 'Overcrowded';
  };

  return (
    <div className="card bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex items-center gap-2 mb-6">
        <Map className="text-indigo-600" size={28} />
        <h3 className="text-xl font-semibold text-gray-800">Campus Occupancy Heatmap</h3>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded"></div>
          <span className="text-gray-700 font-medium">Empty</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-green-200 border-2 border-green-400 rounded"></div>
          <span className="text-gray-700 font-medium">Low (1-25%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
          <span className="text-gray-700 font-medium">Medium (26-50%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-orange-200 border-2 border-orange-400 rounded"></div>
          <span className="text-gray-700 font-medium">High (51-75%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-red-300 border-2 border-red-500 rounded"></div>
          <span className="text-gray-700 font-medium">Full (76-100%)</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-6 h-6 bg-purple-400 border-2 border-purple-600 rounded"></div>
          <span className="text-gray-700 font-medium">Overcrowded</span>
        </div>
      </div>

      {/* Buildings Layout */}
      <div className="space-y-8">
        {buildings.map((building, buildingIndex) => (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: buildingIndex * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200"
          >
            {/* Building Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-4 h-4 rounded-full bg-${building.color}-500`}></div>
              <h4 className="text-xl font-bold text-gray-800">{building.name}</h4>
              <span className="ml-auto text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold">
                {building.rooms.reduce((sum, r) => sum + r.occupancy, 0)} people
              </span>
            </div>

            {/* Floor Plan Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {building.rooms.map((room, roomIndex) => {
                const roomConfig = ROOM_TYPES[room.type];
                const maxOccupancy = roomConfig?.maxOccupancy || 10;
                const percentage = ((room.occupancy / maxOccupancy) * 100).toFixed(0);

                return (
                  <motion.div
                    key={room.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: buildingIndex * 0.1 + roomIndex * 0.05 }}
                    className={`relative p-4 rounded-xl border-3 transition-all hover:scale-105 cursor-pointer ${getHeatColor(room.occupancy, maxOccupancy)}`}
                    title={`${room.name} - ${room.occupancy}/${maxOccupancy} people`}
                  >
                    {/* Room Icon */}
                    <div className="text-3xl mb-2 text-center">
                      {roomConfig?.icon || '🏢'}
                    </div>

                    {/* Room Name */}
                    <p className="text-xs font-bold text-center mb-1 truncate">
                      {room.name}
                    </p>

                    {/* Occupancy */}
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Users size={14} />
                      <span className="text-sm font-bold">
                        {room.occupancy}/{maxOccupancy}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden mb-1">
                      <motion.div
                        className="h-full bg-current"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 0.5, delay: buildingIndex * 0.1 + roomIndex * 0.05 }}
                      />
                    </div>

                    {/* Status Label */}
                    <p className="text-center text-xs font-bold">
                      {getOccupancyLabel(room.occupancy, maxOccupancy)}
                    </p>

                    {/* Floor Badge */}
                    <div className="absolute top-2 right-2 bg-white/80 text-gray-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      F{room.floor}
                    </div>

                    {/* Overcrowded Warning */}
                    {room.occupancy > maxOccupancy && (
                      <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        ⚠️
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Building Summary */}
            <div className="mt-4 pt-4 border-t border-indigo-200 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Total Occupancy</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {building.rooms.reduce((sum, r) => sum + r.occupancy, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Active Rooms</p>
                <p className="text-2xl font-bold text-green-600">
                  {building.rooms.filter(r => r.occupancy > 0).length}/{building.rooms.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Avg Fill Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(building.rooms.reduce((sum, r) => {
                    const max = ROOM_TYPES[r.type]?.maxOccupancy || 10;
                    return sum + (r.occupancy / max);
                  }, 0) / building.rooms.length * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campus Summary */}
      <div className="mt-6 pt-6 border-t-2 border-indigo-300">
        <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Campus Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-center">
            <p className="text-xs text-blue-700 mb-1">Total People</p>
            <p className="text-4xl font-bold text-blue-800">
              {buildings.reduce((sum, b) => sum + b.rooms.reduce((s, r) => s + r.occupancy, 0), 0)}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-center">
            <p className="text-xs text-green-700 mb-1">Active Rooms</p>
            <p className="text-4xl font-bold text-green-800">
              {buildings.reduce((sum, b) => sum + b.rooms.filter(r => r.occupancy > 0).length, 0)}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-center">
            <p className="text-xs text-yellow-700 mb-1">Empty Rooms</p>
            <p className="text-4xl font-bold text-yellow-800">
              {buildings.reduce((sum, b) => sum + b.rooms.filter(r => r.occupancy === 0).length, 0)}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-red-100 to-red-200 border-red-300 text-center">
            <p className="text-xs text-red-700 mb-1">Overcrowded</p>
            <p className="text-4xl font-bold text-red-800">
              {buildings.reduce((sum, b) => sum + b.rooms.filter(r => {
                const max = ROOM_TYPES[r.type]?.maxOccupancy || 10;
                return r.occupancy > max;
              }).length, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OccupancyHeatmap;

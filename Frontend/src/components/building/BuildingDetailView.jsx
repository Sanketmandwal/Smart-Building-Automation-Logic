import { useBuildingContext } from '../../context/BuildingContext';
import { motion } from 'framer-motion';
import { Thermometer, Users, Zap, AlertCircle } from 'lucide-react';

const BuildingDetailView = ({ buildingId, onSelectRoom }) => {
  const { buildings, ROOM_TYPES, calculateRoomPower } = useBuildingContext();
  
  const building = buildings.find(b => b.id === buildingId);
  if (!building) return null;

  // Get power color for heatmap
  const getPowerColor = (power) => {
    if (power === 0) return 'bg-gray-200 border-gray-300 text-gray-600';
    if (power < 500) return 'bg-green-100 border-green-400 text-green-800';
    if (power < 1500) return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    if (power < 3000) return 'bg-orange-100 border-orange-400 text-orange-800';
    return 'bg-red-100 border-red-400 text-red-800';
  };

  // Get status badge
  const getRoomStatus = (room) => {
    if (room.critical) return { text: 'CRITICAL', color: 'bg-purple-500' };
    if (room.occupancy === 0) return { text: 'EMPTY', color: 'bg-gray-400' };
    if (room.occupancy > ROOM_TYPES[room.type]?.maxOccupancy * 0.8) {
      return { text: 'FULL', color: 'bg-red-500' };
    }
    return { text: 'ACTIVE', color: 'bg-green-500' };
  };

  return (
    <div className="space-y-6">
      {/* Building Header */}
      <div className={`card bg-gradient-to-r from-${building.color}-500 to-${building.color}-600 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{building.name}</h2>
            <p className="text-${building.color}-100">
              {building.rooms.length} Rooms • Floor 0-2
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Building ID</p>
            <p className="text-xl font-mono font-bold">{building.id.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Power Distribution Legend */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🎨 Power Heatmap Legend</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">0W (Off)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded"></div>
            <span className="text-xs text-gray-600">&lt;500W (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
            <span className="text-xs text-gray-600">500-1500W (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 border-2 border-orange-400 rounded"></div>
            <span className="text-xs text-gray-600">1500-3000W (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded"></div>
            <span className="text-xs text-gray-600">&gt;3000W (Very High)</span>
          </div>
        </div>
      </div>

      {/* Room Grid - Heatmap Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {building.rooms.map((room, index) => {
          const roomPower = calculateRoomPower(room);
          const powerColor = getPowerColor(roomPower);
          const status = getRoomStatus(room);
          const roomConfig = ROOM_TYPES[room.type];

          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectRoom(room.id)}
              className={`relative rounded-xl border-4 p-5 cursor-pointer transition-all transform hover:scale-105 hover:shadow-2xl ${powerColor}`}
            >
              {/* Status Badge */}
              <div className={`absolute top-3 right-3 ${status.color} text-white px-2 py-1 rounded-full text-[10px] font-bold`}>
                {status.text}
              </div>

              {/* Room Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-5xl">
                  {roomConfig?.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{room.name}</h3>
                  <p className="text-xs opacity-80">{roomConfig?.name}</p>
                  <p className="text-[10px] opacity-60">Floor {room.floor}</p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <Zap size={14} className="mx-auto mb-1 opacity-70" />
                  <p className="text-xs font-semibold">{roomPower}W</p>
                </div>
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <Users size={14} className="mx-auto mb-1 opacity-70" />
                  <p className="text-xs font-semibold">{room.occupancy}/{roomConfig?.maxOccupancy}</p>
                </div>
                <div className="bg-white/70 rounded-lg p-2 text-center">
                  <Thermometer size={14} className="mx-auto mb-1 opacity-70" />
                  <p className="text-xs font-semibold">{room.temperature}°C</p>
                </div>
              </div>

              {/* Device Status Icons */}
              <div className="flex gap-2 justify-center">
                <div className={`text-lg ${room.devices.light.isOn ? 'opacity-100' : 'opacity-30'}`}>
                  💡
                </div>
                <div className={`text-lg ${room.devices.fan.isOn ? 'opacity-100' : 'opacity-30'}`}>
                  💨
                </div>
                <div className={`text-lg ${room.devices.ac.isOn ? 'opacity-100' : 'opacity-30'}`}>
                  ❄️
                </div>
              </div>

              {/* Critical Alert */}
              {room.critical && (
                <div className="mt-2 flex items-center gap-1 justify-center bg-purple-500 text-white rounded px-2 py-1">
                  <AlertCircle size={12} />
                  <span className="text-[10px] font-semibold">24/7 Operation</span>
                </div>
              )}

              {/* Equipment Load */}
              {room.equipmentPower > 0 && (
                <div className="mt-2 text-center">
                  <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    +{room.equipmentPower}W Equipment
                  </span>
                </div>
              )}

              {/* Click Hint */}
              <div className="mt-3 text-center">
                <p className="text-[10px] opacity-60">Click for details →</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Building Summary Footer */}
      <div className="card bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-800">{building.rooms.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Active Rooms</p>
            <p className="text-2xl font-bold text-green-600">
              {building.rooms.filter(r => r.occupancy > 0).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Occupancy</p>
            <p className="text-2xl font-bold text-blue-600">
              {building.rooms.reduce((sum, r) => sum + r.occupancy, 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Building Power</p>
            <p className="text-2xl font-bold text-orange-600">
              {building.rooms.reduce((sum, r) => sum + calculateRoomPower(r), 0)}W
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetailView;

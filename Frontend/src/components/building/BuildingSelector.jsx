import { useBuildingContext } from '../../context/BuildingContext';
import { Building, Zap, Users, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const BuildingSelector = ({ selectedBuildingId, onSelectBuilding }) => {
  const { buildings, calculateBuildingMetrics, ROOM_TYPES } = useBuildingContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {buildings.map((building, index) => {
        const metrics = calculateBuildingMetrics(building);
        const isSelected = selectedBuildingId === building.id;

        return (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectBuilding(building.id)}
            className={`card cursor-pointer transition-all transform hover:scale-105 ${
              isSelected 
                ? `ring-4 ring-${building.color}-500 bg-${building.color}-50` 
                : 'hover:shadow-2xl'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${building.color}-500 rounded-lg flex items-center justify-center`}>
                  <Building className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{building.name}</h3>
                  <p className="text-sm text-gray-600">{building.rooms.length} Rooms</p>
                </div>
              </div>
              {isSelected && (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ACTIVE
                </div>
              )}
            </div>

            {/* Room Type Icons */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {building.rooms.map(room => (
                <div
                  key={room.id}
                  className="text-2xl"
                  title={ROOM_TYPES[room.type]?.name}
                >
                  {ROOM_TYPES[room.type]?.icon}
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <Zap className={`mx-auto mb-1 text-${building.color}-600`} size={20} />
                <p className="text-xs text-gray-600">Power</p>
                <p className="text-lg font-bold text-gray-800">{metrics.totalPower}W</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <Users className={`mx-auto mb-1 text-${building.color}-600`} size={20} />
                <p className="text-xs text-gray-600">Occupancy</p>
                <p className="text-lg font-bold text-gray-800">{metrics.totalOccupancy}</p>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <TrendingDown className={`mx-auto mb-1 text-${building.color}-600`} size={20} />
                <p className="text-xs text-gray-600">Avg Temp</p>
                <p className="text-lg font-bold text-gray-800">{metrics.avgTemperature}°C</p>
              </div>
            </div>

            {/* Click hint */}
            {!isSelected && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">Click to view details →</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BuildingSelector;

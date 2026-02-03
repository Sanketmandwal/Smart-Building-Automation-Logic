import { useBuildingContext } from '../../context/BuildingContext';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const BuildingLeaderboard = () => {
  const { buildings, calculateRoomPower } = useBuildingContext();

  const leaderboardData = buildings.map(building => {
    const totalPower = building.rooms.reduce((sum, room) => sum + calculateRoomPower(room), 0);
    const totalOccupancy = building.rooms.reduce((sum, room) => sum + room.occupancy, 0);
    const activeRooms = building.rooms.filter(r => r.occupancy > 0).length;
    
    const baseline = building.rooms.reduce((sum, room) => {
      const baseDevices = 60 + 75 + (room.type === 'server' ? 2500 : 1500) + (room.equipmentPower || 0);
      return sum + baseDevices;
    }, 0);

    const powerSaved = baseline - totalPower;
    const efficiency = baseline > 0 ? ((powerSaved / baseline) * 100) : 0;
    const powerPerPerson = totalOccupancy > 0 ? totalPower / totalOccupancy : totalPower;

    // Score calculation (weighted)
    const efficiencyScore = efficiency * 0.4;
    const powerScore = Math.max(0, (1 - totalPower / 20000) * 100) * 0.3;
    const occupancyScore = (activeRooms / building.rooms.length) * 100 * 0.3;
    const totalScore = efficiencyScore + powerScore + occupancyScore;

    return {
      ...building,
      totalPower,
      totalOccupancy,
      activeRooms,
      efficiency: efficiency.toFixed(1),
      powerSaved,
      powerPerPerson: powerPerPerson.toFixed(0),
      totalScore: totalScore.toFixed(0)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 0: return <Trophy className="text-yellow-500" size={32} />;
      case 1: return <Medal className="text-gray-400" size={28} />;
      case 2: return <Award className="text-orange-600" size={28} />;
      default: return <span className="text-2xl font-bold text-gray-400">#{rank + 1}</span>;
    }
  };

  return (
    <div className="card bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-600" size={28} />
        <h3 className="text-xl font-semibold text-gray-800">Building Leaderboard</h3>
      </div>

      <div className="space-y-4">
        {leaderboardData.map((building, index) => (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-xl shadow-lg ${
              index === 0 
                ? 'bg-gradient-to-r from-yellow-100 to-amber-100 border-4 border-yellow-400'
                : index === 1
                ? 'bg-gradient-to-r from-gray-100 to-slate-100 border-2 border-gray-300'
                : 'bg-white border-2 border-gray-200'
            }`}
          >
            {/* Rank Badge */}
            <div className="absolute top-2 left-2 z-10">
              {getMedalIcon(index)}
            </div>

            <div className="p-5 pt-12">
              {/* Building Name */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-${building.color}-500`}></div>
                  <h4 className="text-xl font-bold text-gray-800">{building.name}</h4>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-yellow-600">{building.totalScore}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="text-center bg-white/70 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Efficiency</p>
                  <p className="text-lg font-bold text-green-600">{building.efficiency}%</p>
                </div>
                <div className="text-center bg-white/70 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Power</p>
                  <p className="text-lg font-bold text-yellow-600">{building.totalPower}W</p>
                </div>
                <div className="text-center bg-white/70 rounded-lg p-2">
                  <p className="text-xs text-gray-600">Active Rooms</p>
                  <p className="text-lg font-bold text-blue-600">{building.activeRooms}/{building.rooms.length}</p>
                </div>
                <div className="text-center bg-white/70 rounded-lg p-2">
                  <p className="text-xs text-gray-600">W/Person</p>
                  <p className="text-lg font-bold text-purple-600">{building.powerPerPerson}</p>
                </div>
              </div>

              {/* Winner Badge */}
              {index === 0 && (
                <div className="mt-4 text-center">
                  <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    🏆 MOST EFFICIENT BUILDING 🏆
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BuildingLeaderboard;

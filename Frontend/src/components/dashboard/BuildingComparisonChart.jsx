import { useBuildingContext } from '../../context/BuildingContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const BuildingComparisonChart = () => {
  const { buildings, calculateRoomPower } = useBuildingContext();

  // Calculate REAL metrics per building
  const buildingMetrics = buildings.map(building => {
    const totalPower = building.rooms.reduce((sum, room) => {
      return sum + calculateRoomPower(room);
    }, 0);

    const totalOccupancy = building.rooms.reduce((sum, room) => sum + room.occupancy, 0);
    const activeRooms = building.rooms.filter(r => r.occupancy > 0).length;
    
    // Calculate baseline for THIS building
    const baseline = building.rooms.reduce((sum, room) => {
      const baseDevices = 
        60 + // Light
        75 + // Fan
        (room.type === 'server' ? 2500 : room.type === 'cafeteria' ? 2000 : 1500) + // AC
        (room.equipmentPower || 0);
      return sum + baseDevices;
    }, 0);

    const powerSaved = baseline - totalPower;
    const efficiency = baseline > 0 ? ((powerSaved / baseline) * 100).toFixed(1) : 0;
    const powerPerPerson = totalOccupancy > 0 ? (totalPower / totalOccupancy).toFixed(0) : 0;

    return {
      ...building,
      totalPower,
      totalOccupancy,
      activeRooms,
      baseline,
      efficiency: parseFloat(efficiency),
      powerPerPerson,
      powerSaved
    };
  });

  const maxPower = Math.max(...buildingMetrics.map(b => b.totalPower));

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-6">Building Performance Comparison</h3>

      {/* Bar Chart */}
      <div className="space-y-6 mb-6">
        {buildingMetrics.map((building, index) => {
          const powerPercentage = maxPower > 0 ? (building.totalPower / maxPower) * 100 : 0;
          const efficiencyColor = building.efficiency > 70 ? 'green' : building.efficiency > 50 ? 'yellow' : building.efficiency > 30 ? 'orange' : 'red';

          return (
            <div key={building.id}>
              {/* Building Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded bg-${building.color}-500`}></div>
                  <span className="font-semibold text-gray-800">{building.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 font-mono">
                    {building.totalPower}W
                  </span>
                  <span className={`flex items-center gap-1 font-semibold text-${efficiencyColor}-600`}>
                    {building.efficiency > 0 ? (
                      <TrendingDown size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                    {building.efficiency}%
                  </span>
                </div>
              </div>

              {/* Power Bar */}
              <div className="relative h-14 bg-gray-200 rounded-lg overflow-hidden">
                {/* Baseline ghost bar */}
                <div 
                  className="absolute inset-y-0 left-0 bg-gray-300 opacity-30"
                  style={{ width: '100%' }}
                />
                
                {/* Actual power bar */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r from-${building.color}-400 to-${building.color}-600 transition-all duration-500 flex items-center justify-end pr-4`}
                  style={{ width: `${powerPercentage}%` }}
                >
                  {powerPercentage > 25 && (
                    <span className="text-white font-bold text-sm drop-shadow-lg">
                      {building.totalPower}W
                    </span>
                  )}
                </div>

                {/* Savings indicator */}
                {building.powerSaved > 0 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    -{building.powerSaved}W saved
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-600">
                <div className="text-center bg-gray-50 rounded p-2">
                  <span className="block text-gray-500 mb-1">Active Rooms</span>
                  <span className="font-semibold text-base">{building.activeRooms}/{building.rooms.length}</span>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <span className="block text-gray-500 mb-1">People</span>
                  <span className="font-semibold text-base">{building.totalOccupancy}</span>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <span className="block text-gray-500 mb-1">W/Person</span>
                  <span className="font-semibold text-base">{building.powerPerPerson || 'N/A'}</span>
                </div>
                <div className="text-center bg-gray-50 rounded p-2">
                  <span className="block text-gray-500 mb-1">Efficiency</span>
                  <span className={`font-semibold text-base text-${efficiencyColor}-600`}>
                    {building.efficiency}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner Badge */}
      {buildingMetrics.length > 0 && (
        <div className="pt-4 border-t">
          {(() => {
            const mostEfficient = buildingMetrics.reduce((prev, current) =>
              current.efficiency > prev.efficiency ? current : prev
            );
            
            const mostPowerSaved = buildingMetrics.reduce((prev, current) =>
              current.powerSaved > prev.powerSaved ? current : prev
            );
            
            return (
              <div className="space-y-3">
                {/* Most Efficient */}
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <p className="text-xs text-gray-600">Most Efficient Building</p>
                      <p className="text-lg font-bold text-green-700">{mostEfficient.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{mostEfficient.efficiency}%</p>
                    <p className="text-xs text-gray-600">Efficiency</p>
                  </div>
                </div>

                {/* Most Savings */}
                {mostPowerSaved.powerSaved > 0 && (
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-300">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">💰</div>
                      <div>
                        <p className="text-xs text-gray-600">Highest Energy Savings</p>
                        <p className="text-lg font-bold text-blue-700">{mostPowerSaved.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{mostPowerSaved.powerSaved}W</p>
                      <p className="text-xs text-gray-600">Power Saved</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default BuildingComparisonChart;

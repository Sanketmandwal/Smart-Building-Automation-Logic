import { useBuildingContext } from '../../context/BuildingContext';
import { Heart, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const BuildingHealthScore = () => {
  const { buildings, campusMetrics, calculateRoomPower, ROOM_TYPES } = useBuildingContext();

  // Calculate health score for a building (0-100)
  const calculateBuildingHealth = (building) => {
    let score = 100;
    let factors = [];

    building.rooms.forEach(room => {
      const roomConfig = ROOM_TYPES[room.type];
      const roomPower = calculateRoomPower(room);
      const maxOccupancy = roomConfig?.maxOccupancy || 10;

      // Factor 1: Temperature comfort (-20 points if too hot/cold)
      const idealTemp = roomConfig?.baseTemp || 24;
      const tempDiff = Math.abs(room.temperature - idealTemp);
      if (tempDiff > 5) {
        score -= 15;
        factors.push({
          room: room.name,
          issue: `Temperature ${tempDiff}°C away from ideal`,
          severity: 'medium',
          impact: -15
        });
      } else if (tempDiff > 3) {
        score -= 5;
        factors.push({
          room: room.name,
          issue: `Slight temperature deviation`,
          severity: 'low',
          impact: -5
        });
      }

      // Factor 2: Humidity (-10 points if too high/low)
      if (room.humidity > 70) {
        score -= 10;
        factors.push({
          room: room.name,
          issue: `High humidity ${room.humidity}%`,
          severity: 'medium',
          impact: -10
        });
      } else if (room.humidity < 40) {
        score -= 8;
        factors.push({
          room: room.name,
          issue: `Low humidity ${room.humidity}%`,
          severity: 'low',
          impact: -8
        });
      }

      // Factor 3: Overcrowding (-15 points if over capacity)
      if (room.occupancy > maxOccupancy) {
        score -= 15;
        factors.push({
          room: room.name,
          issue: `Overcrowded (${room.occupancy}/${maxOccupancy})`,
          severity: 'high',
          impact: -15
        });
      }

      // Factor 4: Empty room wasting power (-10 points)
      if (room.occupancy === 0 && roomPower > 200 && room.type !== 'server') {
        score -= 10;
        factors.push({
          room: room.name,
          issue: `Empty but consuming ${roomPower}W`,
          severity: 'medium',
          impact: -10
        });
      }

      // Factor 5: Server room critical temp (-25 points)
      if (room.type === 'server' && room.temperature > 22) {
        score -= 25;
        factors.push({
          room: room.name,
          issue: `CRITICAL: Server room at ${room.temperature}°C`,
          severity: 'critical',
          impact: -25
        });
      }
    });

    // Factor 6: Overall efficiency bonus
    if (campusMetrics.efficiency > 70) {
      score += 10;
      factors.push({
        room: 'Campus-wide',
        issue: `Excellent efficiency ${campusMetrics.efficiency}%`,
        severity: 'positive',
        impact: +10
      });
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      factors: factors.slice(0, 5) // Top 5 factors
    };
  };

  const buildingHealthData = buildings.map(building => ({
    ...building,
    health: calculateBuildingHealth(building)
  }));

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-lime-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'from-green-400 to-emerald-500';
    if (score >= 75) return 'from-lime-400 to-green-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-600" size={16} />;
      case 'high':
        return <AlertTriangle className="text-orange-600" size={16} />;
      case 'medium':
        return <TrendingDown className="text-yellow-600" size={16} />;
      case 'low':
        return <TrendingDown className="text-blue-600" size={16} />;
      case 'positive':
        return <CheckCircle className="text-green-600" size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="card bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-pink-600" size={28} />
        <h3 className="text-xl font-semibold text-gray-800">Building Health Score</h3>
      </div>

      <div className="space-y-6">
        {buildingHealthData.map((building, index) => (
          <motion.div
            key={building.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-5 shadow-lg border-2 border-purple-200"
          >
            {/* Building Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-${building.color}-500`}></div>
                <h4 className="text-lg font-bold text-gray-800">{building.name}</h4>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1">{getScoreLabel(building.health.score)}</p>
                <p className={`text-4xl font-bold ${getScoreColor(building.health.score)}`}>
                  {building.health.score}
                </p>
              </div>
            </div>

            {/* Health Gauge */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getScoreBg(building.health.score)} flex items-center justify-end pr-3`}
                  initial={{ width: 0 }}
                  animate={{ width: `${building.health.score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <span className="text-white font-bold text-xs">{building.health.score}/100</span>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Critical</span>
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Health Factors */}
            {building.health.factors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">Health Factors:</p>
                {building.health.factors.map((factor, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2 rounded text-xs ${
                      factor.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                      factor.severity === 'high' ? 'bg-orange-50 border border-orange-200' :
                      factor.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                      factor.severity === 'positive' ? 'bg-green-50 border border-green-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    {getSeverityIcon(factor.severity)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{factor.room}</p>
                      <p className="text-gray-600">{factor.issue}</p>
                    </div>
                    <span className={`font-bold ${factor.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {factor.impact > 0 ? '+' : ''}{factor.impact}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {building.health.factors.length === 0 && (
              <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="text-green-600 mx-auto mb-2" size={32} />
                <p className="text-sm font-semibold text-green-700">Perfect Health! 🎉</p>
                <p className="text-xs text-green-600">All systems optimal</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Campus Average */}
      <div className="mt-6 pt-6 border-t border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Campus Average Health</p>
            <p className="text-xs text-gray-500 mt-1">
              {buildingHealthData.length} buildings monitored
            </p>
          </div>
          <div className="text-right">
            <p className={`text-5xl font-bold ${getScoreColor(
              buildingHealthData.reduce((sum, b) => sum + b.health.score, 0) / buildingHealthData.length
            )}`}>
              {Math.round(buildingHealthData.reduce((sum, b) => sum + b.health.score, 0) / buildingHealthData.length)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {getScoreLabel(Math.round(buildingHealthData.reduce((sum, b) => sum + b.health.score, 0) / buildingHealthData.length))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingHealthScore;

import { useState, useEffect } from 'react';
import { useBuildingContext } from '../../context/BuildingContext';
import { Activity } from 'lucide-react';

const PowerConsumptionChart = () => {
  const { buildings, campusMetrics, isSimulationRunning, calculateRoomPower } = useBuildingContext();
  const [powerHistory, setPowerHistory] = useState([]);

  // Track power over time (real data from buildings)
  useEffect(() => {
    if (!isSimulationRunning) {
      setPowerHistory([]);
      return;
    }

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });

      // Calculate REAL power from actual building state
      const buildingAPower = buildings[0].rooms.reduce((sum, room) => {
        return sum + calculateRoomPower(room);
      }, 0);

      const buildingBPower = buildings[1].rooms.reduce((sum, room) => {
        return sum + calculateRoomPower(room);
      }, 0);

      setPowerHistory(prev => {
        const newHistory = [
          ...prev,
          {
            time: timestamp,
            buildingA: buildingAPower,
            buildingB: buildingBPower,
            total: campusMetrics.totalPower,
            baseline: campusMetrics.baselinePower
          }
        ];
        // Keep last 30 data points
        return newHistory.slice(-30);
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isSimulationRunning, buildings, campusMetrics, calculateRoomPower]);

  // Render SVG chart
  const renderChart = () => {
    if (powerHistory.length < 2) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Activity className="mx-auto mb-2 animate-pulse" size={48} />
            <p className="font-medium">Waiting for data...</p>
            <p className="text-sm mt-1">Start simulation to see live chart</p>
          </div>
        </div>
      );
    }

    const width = 700;
    const height = 300;
    const padding = 50;

    const maxPower = Math.max(...powerHistory.map(h => h.baseline)) * 1.1;
    const xStep = (width - padding * 2) / (powerHistory.length - 1);

    const getY = (value) => {
      return height - padding - ((value / maxPower) * (height - padding * 2));
    };

    const createPath = (key, color, strokeWidth = 2) => {
      const points = powerHistory.map((h, i) => {
        const x = padding + i * xStep;
        const y = getY(h[key]);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
      return <path d={points} fill="none" stroke={color} strokeWidth={strokeWidth} />;
    };

    return (
      <svg width="100%" height="300" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((factor, i) => {
          const y = getY(maxPower * factor);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <text x={padding - 40} y={y + 4} fontSize="11" fill="#6b7280" fontWeight="500">
                {Math.round(maxPower * factor)}W
              </text>
            </g>
          );
        })}

        {/* X-axis labels (time) */}
        {powerHistory.length > 0 && [0, Math.floor(powerHistory.length / 2), powerHistory.length - 1].map((index) => {
          if (index >= powerHistory.length) return null;
          const x = padding + index * xStep;
          return (
            <text 
              key={`time-${index}`}
              x={x} 
              y={height - padding + 20} 
              fontSize="10" 
              fill="#6b7280" 
              textAnchor="middle"
            >
              {powerHistory[index].time.split(':').slice(1).join(':')}
            </text>
          );
        })}

        {/* Baseline (dashed red) */}
        {createPath('baseline', '#ef4444', 2)}
        <path 
          d={powerHistory.map((h, i) => {
            const x = padding + i * xStep;
            const y = getY(h.baseline);
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ')}
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="2"
          strokeDasharray="8,4"
        />
        
        {/* Total Power (green) */}
        {createPath('total', '#10b981', 3)}
        
        {/* Building A (blue) */}
        {createPath('buildingA', '#3b82f6', 2)}
        
        {/* Building B (purple) */}
        {createPath('buildingB', '#8b5cf6', 2)}

        {/* Dots on latest points */}
        {powerHistory.length > 0 && (
          <>
            <circle cx={padding + (powerHistory.length - 1) * xStep} cy={getY(powerHistory[powerHistory.length - 1].total)} r="4" fill="#10b981" />
            <circle cx={padding + (powerHistory.length - 1) * xStep} cy={getY(powerHistory[powerHistory.length - 1].buildingA)} r="3" fill="#3b82f6" />
            <circle cx={padding + (powerHistory.length - 1) * xStep} cy={getY(powerHistory[powerHistory.length - 1].buildingB)} r="3" fill="#8b5cf6" />
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Live Power Consumption</h3>
        {isSimulationRunning && (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        )}
      </div>

      {renderChart()}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-red-500 border-dashed border-2 border-red-500 rounded"></div>
          <span className="text-gray-600">Baseline (No Auto)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-green-500 rounded"></div>
          <span className="text-gray-600 font-semibold">Total Campus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Building A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-purple-500 rounded"></div>
          <span className="text-gray-600">Building B</span>
        </div>
      </div>

      {/* Real-time Stats */}
      {powerHistory.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Current Total</p>
            <p className="text-2xl font-bold text-green-600">{campusMetrics.totalPower}W</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">vs Baseline</p>
            <p className="text-2xl font-bold text-red-600">{campusMetrics.baselinePower}W</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Savings</p>
            <p className="text-2xl font-bold text-blue-600">{campusMetrics.efficiency}%</p>
          </div>
        </div>
      )}

      {!isSimulationRunning && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
          <p className="text-sm text-blue-800">
            ▶️ Start simulation to see real-time power monitoring
          </p>
        </div>
      )}
    </div>
  );
};

export default PowerConsumptionChart;

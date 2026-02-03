import { useState } from 'react';
import { useBuildingContext } from '../context/BuildingContext';
import { Building2, Activity, AlertTriangle } from 'lucide-react';
import CampusMetricsCards from '../components/dashboard/CampusMetricsCards';
import PowerConsumptionChart from '../components/dashboard/PowerConsumptionChart';
import BuildingComparisonChart from '../components/dashboard/BuildingComparisonChart';
import EnvironmentalImpact from '../components/dashboard/EnvironmentalImpact';
import AIInsightsPanel from '../components/dashboard/AIInsightsPanel';
import BuildingSelector from '../components/building/BuildingSelector';
import BuildingDetailView from '../components/building/BuildingDetailView';
import RoomDetailModal from '../components/building/RoomDetailModal';
import LiveCostTicker from '../components/dashboard/LiveCostTicker';
import NotificationSystem from '../components/notifications/NotificationSystem';
import BuildingHealthScore from '../components/dashboard/BuildingHealthScore';
import PredictiveMaintenance from '../components/dashboard/PredictiveMaintenance';
import WhatIfSimulator from '../components/dashboard/WhatIfSimulator';
import OccupancyHeatmap from '../components/dashboard/OccupancyHeatmap';
import PDFExport from '../components/dashboard/PDFExport';
import BuildingLeaderboard from '../components/dashboard/BuildingLeaderboard';

const CampusDashboard = () => {
  const {
    buildings,
    automationMode,
    setAutomationMode,
    isSimulationRunning,
    toggleSimulation,
    resetSimulation,
    timeOfDay,
    setTimeOfDay,
    isLoading,
    apiError
  } = useBuildingContext();

  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const viewMode = selectedBuildingId ? 'building-detail' : 'overview';

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <Building2 className="text-blue-600" size={40} />
                Smart Campus Control Center
              </h1>
              <p className="text-gray-600">
                Real-time monitoring • {buildings.length} buildings • {buildings.reduce((sum, b) => sum + b.rooms.length, 0)} rooms
              </p>
            </div>

            {/* Simulation Controls */}
            <div className="flex gap-3">
              <button
                onClick={toggleSimulation}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${isSimulationRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : isSimulationRunning ? (
                  <>
                    <Activity className="animate-pulse" size={20} />
                    Running
                  </>
                ) : (
                  <>
                    <Activity size={20} />
                    Start Automation
                  </>
                )}
              </button>

              <button
                onClick={resetSimulation}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold disabled:opacity-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Backend Connection Error</h3>
                  <p className="text-red-700 text-sm mb-2">{apiError}</p>
                  <div className="bg-red-100 rounded p-2 text-xs font-mono text-red-900">
                    <p className="font-semibold mb-1">Quick Fix:</p>
                    <p>1. Open terminal in backend folder</p>
                    <p>2. Run: npm run dev</p>
                    <p>3. Wait for "Server running on port 5000"</p>
                    <p>4. Refresh this page</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Automation Mode Selector */}
          <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Automation Mode</h3>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setAutomationMode('none')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${automationMode === 'none'
                      ? 'bg-white text-red-600 shadow-lg scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                      } disabled:opacity-50`}
                  >
                    🚫 No Automation
                  </button>
                  <button
                    onClick={() => setAutomationMode('rule-based')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${automationMode === 'rule-based'
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                      } disabled:opacity-50`}
                  >
                    ⚙️ Rule-Based
                  </button>
                  <button
                    onClick={() => setAutomationMode('context-aware')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${automationMode === 'context-aware'
                      ? 'bg-white text-green-600 shadow-lg scale-105'
                      : 'bg-white/20 hover:bg-white/30'
                      } disabled:opacity-50`}
                  >
                    🤖 AI Context-Aware
                  </button>
                </div>
              </div>

              {/* Day/Night Toggle */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Time of Day</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeOfDay('day')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${timeOfDay === 'day'
                      ? 'bg-yellow-400 text-gray-800'
                      : 'bg-white/20 hover:bg-white/30'
                      } disabled:opacity-50`}
                  >
                    ☀️ Day
                  </button>
                  <button
                    onClick={() => setTimeOfDay('night')}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${timeOfDay === 'night'
                      ? 'bg-indigo-800 text-white'
                      : 'bg-white/20 hover:bg-white/30'
                      } disabled:opacity-50`}
                  >
                    🌙 Night
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Metrics */}
        <CampusMetricsCards />

        {/* ✅ NEW: Live Cost Ticker */}
        <div className="mb-8">
          <LiveCostTicker />
        </div>

        {/* ✅ NEW: What-If Simulator Button */}
        <div className="mb-8">
          <WhatIfSimulator />
        </div>

        <div className="mb-8">
          <PDFExport />
        </div>

        {/* Main Content */}
        {viewMode === 'overview' ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Campus Buildings</h2>
                <span className="text-sm text-gray-600">Click a building to view details</span>
              </div>
              <BuildingSelector
                selectedBuildingId={selectedBuildingId}
                onSelectBuilding={setSelectedBuildingId}
              />
            </div>

            {/* Power Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PowerConsumptionChart />
              <BuildingComparisonChart />
            </div>

            {/* ✅ NEW: Building Leaderboard */}
            <div className="mb-8">
              <BuildingLeaderboard />
            </div>

            {/* Environmental Impact */}
            <div className="mb-8">
              <EnvironmentalImpact />
            </div>

            {/* ✅ NEW: Occupancy Heatmap */}
            <div className="mb-8">
              <OccupancyHeatmap />
            </div>


            {/* ✅ UPDATED: 3-Column Grid with All Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <AIInsightsPanel />
              </div>
              <div>
                <BuildingHealthScore />
              </div>
              <div>
                <PredictiveMaintenance />
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedBuildingId(null)}
              className="mb-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              ← Back to Campus Overview
            </button>

            <BuildingDetailView
              buildingId={selectedBuildingId}
              onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
            />
          </>
        )}
      </div>

      {/* Room Detail Modal */}
      {selectedRoomId && (
        <RoomDetailModal
          buildingId={selectedBuildingId}
          roomId={selectedRoomId}
          onClose={() => setSelectedRoomId(null)}
        />
      )}

      {/* ✅ Notification System */}
      <NotificationSystem />
    </div>
  );
};

export default CampusDashboard;

import { useSimulation } from '../context/SimulationContext';
import Room from '../components/simulation/Room';
import EnvironmentControls from '../components/simulation/EnvironmentControls';
import PowerMeter from '../components/simulation/PowerMeter';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Simulation = () => {
  const { 
    isSimulationRunning, 
    toggleAutomation, 
    resetSimulation,
    automationMode,
    setAutomationMode 
  } = useSimulation();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Live Simulation
          </h1>
          <p className="text-gray-600">
            Interact with the room and observe real-time automation responses
          </p>
        </div>

        {/* Control Panel */}
        <div className="card mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Automation Mode Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAutomationMode('none')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    automationMode === 'none'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No Automation
                </button>
                <button
                  onClick={() => setAutomationMode('rule-based')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    automationMode === 'rule-based'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Rule-Based
                </button>
                <button
                  onClick={() => setAutomationMode('context-aware')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    automationMode === 'context-aware'
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Context-Aware
                </button>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex gap-3">
              <button
                onClick={toggleAutomation}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isSimulationRunning
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isSimulationRunning ? (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={resetSimulation}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Visualization */}
          <div className="lg:col-span-2">
            <Room />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <PowerMeter />
            <EnvironmentControls />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 card bg-blue-50 border-l-4 border-blue-500">
          <h3 className="font-semibold text-blue-800 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li>• Select an automation mode above</li>
            <li>• Click "Start" to enable automation logic</li>
            <li>• Click on people outside the room to move them inside</li>
            <li>• Click on people inside to move them outside</li>
            <li>• Adjust environment controls (day/night, temperature)</li>
            <li>• Observe how devices respond to different conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Simulation;

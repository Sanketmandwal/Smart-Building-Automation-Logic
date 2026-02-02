import { useSimulation } from '../../context/SimulationContext';
import { XCircle, Cpu, Brain } from 'lucide-react';

const ModeSelector = () => {
  const { automationMode, setAutomationMode } = useSimulation();

  const modes = [
    {
      id: 'none',
      name: 'No Automation',
      icon: <XCircle size={24} />,
      color: 'red',
      description: 'Manual control, all devices at full capacity'
    },
    {
      id: 'rule-based',
      name: 'Rule-Based',
      icon: <Cpu size={24} />,
      color: 'blue',
      description: 'Automated rules based on occupancy and conditions'
    },
    {
      id: 'context-aware',
      name: 'Context-Aware',
      icon: <Brain size={24} />,
      color: 'green',
      description: 'AI-powered predictive optimization'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      red: {
        border: 'border-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: 'text-red-500',
        hover: 'hover:border-red-400',
        activeBg: 'bg-red-500',
        activeText: 'text-white'
      },
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: 'text-blue-500',
        hover: 'hover:border-blue-400',
        activeBg: 'bg-blue-500',
        activeText: 'text-white'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: 'text-green-500',
        hover: 'hover:border-green-400',
        activeBg: 'bg-green-500',
        activeText: 'text-white'
      }
    };

    return colors[color];
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Select Automation Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const isActive = automationMode === mode.id;
          const colorClass = getColorClasses(mode.color, isActive);

          return (
            <button
              key={mode.id}
              onClick={() => setAutomationMode(mode.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isActive
                  ? `${colorClass.activeBg} ${colorClass.activeText} border-transparent shadow-lg transform scale-105`
                  : `bg-white ${colorClass.border} ${colorClass.hover} hover:shadow-md`
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`${isActive ? 'text-white' : colorClass.icon}`}>
                  {mode.icon}
                </div>
                <h3 className="font-semibold text-lg">{mode.name}</h3>
              </div>
              <p className={`text-sm ${
                isActive ? 'text-white/90' : 'text-gray-600'
              }`}>
                {mode.description}
              </p>
              {isActive && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Active</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;

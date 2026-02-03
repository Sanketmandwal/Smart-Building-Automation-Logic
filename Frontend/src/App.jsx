import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { BuildingProvider } from './context/BuildingContext';
import CampusDashboard from './pages/CampusDashboard';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Simulation from './pages/Simulation';

function App() {
  return (
    <BuildingProvider>
    <SimulationProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<CampusDashboard />} />  {/* Updated to new campus dashboard */}
            <Route path="/simulation" element={<Simulation />} />
          </Routes>
        </div>
      </Router>
    </SimulationProvider>
    </BuildingProvider>
  );
}

export default App;

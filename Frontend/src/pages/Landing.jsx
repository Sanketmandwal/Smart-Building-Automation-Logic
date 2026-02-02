import { Link } from 'react-router-dom';
import { Zap, TrendingDown, Brain, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Smart Building Automation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Optimize lighting, HVAC, and power usage with intelligent automation
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/simulation" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Try Demo <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link to="/dashboard" className="btn-secondary border-white text-white hover:bg-white/10">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Three Automation Modes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-gray-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Automation</h3>
              <p className="text-gray-600">Traditional building operation with manual controls and constant power usage</p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rule-Based</h3>
              <p className="text-gray-600">Automated control using predefined rules based on occupancy and environmental conditions</p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-accent-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Context-Aware</h3>
              <p className="text-gray-600">AI-powered optimization that learns patterns and predicts energy needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Occupancy Detection</h3>
                    <p className="text-gray-600">Sensors detect when people enter or leave the room</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Environmental Analysis</h3>
                    <p className="text-gray-600">Monitor temperature, light intensity, and time of day</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Smart Optimization</h3>
                    <p className="text-gray-600">Automatically adjust devices for comfort and energy efficiency</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Energy Savings</h3>
                    <p className="text-gray-600">Reduce power consumption by up to 60-70% compared to traditional systems</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-primary-50 to-accent-50">
              <div className="text-center py-12">
                <div className="text-6xl font-bold text-primary-600 mb-2">60-70%</div>
                <p className="text-xl text-gray-700">Energy Savings</p>
                <p className="text-gray-600 mt-4">With intelligent automation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

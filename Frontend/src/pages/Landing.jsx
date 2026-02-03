import { Link } from 'react-router-dom';
import { Building2, Zap, TrendingDown, Brain, ArrowRight, CheckCircle, Users, Leaf, DollarSign, Award, Target, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Landing = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white mb-6 border border-white/30"
            >
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Powered by AI & IoT</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Smart Campus
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                Energy Revolution
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Slash energy costs by <span className="font-bold text-yellow-300">70%</span> with AI-powered building automation. 
              Real-time monitoring, predictive analytics, and zero-waste operations.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all flex items-center gap-2"
                >
                  <Building2 size={24} />
                  Launch Dashboard
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Watch Demo Video
              </motion.button>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              {[
                { value: '70%', label: 'Energy Saved' },
                { value: '2', label: 'Buildings' },
                { value: '8', label: 'Smart Rooms' },
                { value: '24/7', label: 'Monitoring' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your campus into a sustainable, cost-effective smart building
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="text-yellow-500" size={40} />,
                title: 'Real-Time Optimization',
                description: 'Monitor and control all building systems from a single dashboard with live updates every 2 seconds',
                color: 'from-yellow-400 to-orange-500',
                stats: '2s refresh'
              },
              {
                icon: <Brain className="text-purple-500" size={40} />,
                title: 'AI-Powered Intelligence',
                description: 'Context-aware automation learns patterns, predicts needs, and optimizes energy usage automatically',
                color: 'from-purple-400 to-pink-500',
                stats: '5-10% better'
              },
              {
                icon: <DollarSign className="text-green-500" size={40} />,
                title: 'Massive Cost Savings',
                description: 'Reduce energy bills by 60-70% with intelligent automation and zero-waste operations',
                color: 'from-green-400 to-emerald-500',
                stats: '₹8/kWh saved'
              },
              {
                icon: <Leaf className="text-emerald-500" size={40} />,
                title: 'Environmental Impact',
                description: 'Track CO₂ reduction, trees equivalent, and contribute to a greener planet',
                color: 'from-emerald-400 to-teal-500',
                stats: '0.82 kg CO₂/kWh'
              },
              {
                icon: <Target className="text-blue-500" size={40} />,
                title: 'Predictive Maintenance',
                description: 'AI predicts device failures before they happen. Save on repair costs and downtime',
                color: 'from-blue-400 to-cyan-500',
                stats: '90% accuracy'
              },
              {
                icon: <Award className="text-red-500" size={40} />,
                title: 'Building Competition',
                description: 'Gamified leaderboard ranks buildings by efficiency. Motivate teams with real metrics',
                color: 'from-red-400 to-pink-500',
                stats: 'Live rankings'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group-hover:border-transparent">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  <div className={`inline-block bg-gradient-to-r ${feature.color} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                    {feature.stats}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AUTOMATION MODES ========== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Three Automation Modes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect level of automation for your building
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                mode: 'No Automation',
                icon: '🚫',
                color: 'red',
                savings: '0%',
                description: 'Traditional manual control. All devices run at full capacity regardless of usage.',
                features: ['Manual switches', 'Constant power', 'No optimization', 'High costs'],
                recommended: false
              },
              {
                mode: 'Rule-Based',
                icon: '⚙️',
                color: 'blue',
                savings: '60-65%',
                description: 'Smart automation using predefined rules based on occupancy and environmental sensors.',
                features: ['Occupancy detection', 'Time-based control', 'Temperature sensing', 'Automated switching'],
                recommended: true
              },
              {
                mode: 'AI Context-Aware',
                icon: '🤖',
                color: 'green',
                savings: '65-70%',
                description: 'Machine learning algorithms predict patterns and optimize energy usage proactively.',
                features: ['Pattern learning', 'Predictive pre-cooling', 'Trend analysis', 'Adaptive optimization'],
                recommended: true
              },
            ].map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -15 }}
                className={`relative bg-gradient-to-br ${
                  mode.color === 'red' ? 'from-red-50 to-orange-50 border-red-200' :
                  mode.color === 'blue' ? 'from-blue-50 to-cyan-50 border-blue-200' :
                  'from-green-50 to-emerald-50 border-green-200'
                } rounded-3xl p-8 border-2 shadow-lg hover:shadow-2xl transition-all`}
              >
                {mode.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="text-6xl mb-4 text-center">{mode.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{mode.mode}</h3>
                
                <div className={`text-center mb-4`}>
                  <span className={`text-5xl font-black ${
                    mode.color === 'red' ? 'text-red-600' :
                    mode.color === 'blue' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {mode.savings}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Energy Savings</p>
                </div>

                <p className="text-gray-700 mb-6 text-center leading-relaxed">{mode.description}</p>

                <div className="space-y-2">
                  {mode.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className={`${
                        mode.color === 'red' ? 'text-red-500' :
                        mode.color === 'blue' ? 'text-blue-500' :
                        'text-green-500'
                      }`} size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to energy efficiency
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                {
                  step: '1',
                  title: 'Occupancy Detection',
                  description: 'IoT sensors detect when people enter or leave rooms in real-time',
                  icon: <Users size={40} />,
                  color: 'from-blue-400 to-cyan-500'
                },
                {
                  step: '2',
                  title: 'Environmental Analysis',
                  description: 'Monitor temperature, humidity, sunlight intensity, and time of day',
                  icon: <Target size={40} />,
                  color: 'from-purple-400 to-pink-500'
                },
                {
                  step: '3',
                  title: 'AI Optimization',
                  description: 'Machine learning algorithms calculate optimal device settings',
                  icon: <Brain size={40} />,
                  color: 'from-pink-400 to-red-500'
                },
                {
                  step: '4',
                  title: 'Energy Savings',
                  description: 'Automated control reduces consumption by 60-70% while maintaining comfort',
                  icon: <Zap size={40} />,
                  color: 'from-green-400 to-emerald-500'
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                      {item.step}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                    <p className="text-gray-600 text-center leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Campus?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join the smart building revolution. Start saving energy and costs today with our AI-powered automation platform.
            </p>

            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-12 py-5 bg-white text-purple-600 rounded-full font-black text-xl shadow-2xl hover:shadow-white/50 transition-all inline-flex items-center gap-3"
              >
                <Building2 size={28} />
                Launch Dashboard Now
                <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
              </motion.button>
            </Link>

            <p className="text-white/70 mt-8 text-sm">
              ✨ No credit card required • 🚀 Instant access • 💯 Free demo
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

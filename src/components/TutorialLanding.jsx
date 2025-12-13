import React from 'react';

const TutorialLanding = ({ handleStartTutorial }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CAD Fundamentals Tutorial
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Master the essential skills of 3D modeling through our comprehensive, hands-on tutorial. 
            Learn industry-standard CAD concepts step by step.
          </p>
        </div>
        
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-10 mb-12 border border-white/20">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-8 text-center">What You'll Learn</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-green-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🧭</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-green-400">3D Navigation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Master viewport controls, coordinate systems, and 3D space orientation.</p>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-blue-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🔷</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-400">Primitive Shapes</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Create cubes, spheres, cylinders, and cones - the building blocks of CAD.</p>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-purple-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-purple-400">Transformations</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Move, rotate, and scale objects with precision using professional tools.</p>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-orange-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-orange-400">Precision Work</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Learn accurate positioning and measurement techniques for professional results.</p>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-red-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-rose-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-red-400">Assembly Basics</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Combine multiple objects to create complex structures and assemblies.</p>
              </div>
              
              <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 hover:border-teal-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-teal-400">Best Practices</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Professional workflow, organization, and design iteration techniques.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-center">Tutorial Overview</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <p className="text-gray-300"><span className="text-cyan-400 font-semibold">Duration:</span> 15-20 minutes</p>
                  <p className="text-gray-300"><span className="text-purple-400 font-semibold">Difficulty:</span> Beginner-friendly</p>
                  <p className="text-gray-300"><span className="text-pink-400 font-semibold">Prerequisites:</span> None required</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-300"><span className="text-green-400 font-semibold">Steps:</span> 16 interactive lessons</p>
                  <p className="text-gray-300"><span className="text-blue-400 font-semibold">Format:</span> Hands-on practice</p>
                  <p className="text-gray-300"><span className="text-orange-400 font-semibold">Progress:</span> Self-paced learning</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleStartTutorial}
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-6 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-xl shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <span className="relative flex items-center">
                  <span className="mr-3 text-2xl">🚀</span>
                  Start Interactive Tutorial
                </span>
              </button>
              <p className="text-gray-400 mt-4 text-lg">
                Begin your journey into 3D modeling and CAD design
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-yellow-500/50">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">💡 Learning Tips</h3>
            <ul className="text-gray-300 space-y-3 text-sm leading-relaxed">
              <li>• Take your time with each step</li>
              <li>• Practice the mouse controls</li>
              <li>• Experiment with different positions</li>
              <li>• Don't hesitate to repeat steps</li>
            </ul>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-cyan-500/50">
            <h3 className="text-xl font-bold mb-4 text-cyan-400">🎮 Controls Preview</h3>
            <ul className="text-gray-300 space-y-3 text-sm leading-relaxed">
              <li>• <span className="text-cyan-300 font-semibold">Left-click + drag:</span> Rotate view</li>
              <li>• <span className="text-cyan-300 font-semibold">Right-click + drag:</span> Pan view</li>
              <li>• <span className="text-cyan-300 font-semibold">Scroll wheel:</span> Zoom in/out</li>
              <li>• <span className="text-cyan-300 font-semibold">Click object:</span> Select it</li>
            </ul>
          </div>
          
          <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-purple-500/50">
            <h3 className="text-xl font-bold mb-4 text-purple-400">🏆 After Tutorial</h3>
            <ul className="text-gray-300 space-y-3 text-sm leading-relaxed">
              <li>• Explore the Playground mode</li>
              <li>• Try the Challenge mode</li>
              <li>• Create your own designs</li>
              <li>• Build complex assemblies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialLanding;

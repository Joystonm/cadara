import React from 'react';

const ChallengeLanding = ({ challengesData, completedChallenges, categorizedChallenges, setSelectedChallenge, isUnlocked }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                CAD Challenges
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Master CAD skills through hands-on challenges focused on assistive technology
            </p>
            
            <div className="flex justify-center space-x-12 mb-16">
              <div className="text-center group">
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  {challengesData.challenges.length}
                </div>
                <div className="text-gray-400 font-medium">Total Challenges</div>
              </div>
              <div className="text-center group">
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
                  {challengesData.challenges.filter(c => c.assistiveTechFocus).length}
                </div>
                <div className="text-gray-400 font-medium">Assistive Tech</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-20">
          {/* Challenges by Category */}
          {Object.entries(categorizedChallenges).map(([categoryKey, challenges]) => {
            const categoryInfo = challengesData.categories[categoryKey];
            
            return (
              <div key={categoryKey} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl">{categoryInfo.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{categoryInfo.name}</h2>
                    <p className="text-gray-400">{categoryInfo.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge) => {
                    const isCompleted = completedChallenges.includes(challenge.id);
                    const locked = !isUnlocked(challenge.id);

                    return (
                      <div 
                        key={challenge.id} 
                        className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:-translate-y-2 ${
                          locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-purple-500/50 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20'
                        }`}
                        onClick={() => !locked && setSelectedChallenge(challenge)}
                      >
                        {locked && (
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm">🔒</span>
                            </div>
                          </div>
                        )}
                        
                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-sm">✓</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-200">
                              {challenge.title}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                challenge.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                challenge.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {challenge.difficulty}
                              </span>
                              {challenge.assistiveTechFocus && (
                                <span className="text-lg">♿</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                          {challenge.description}
                        </p>

                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-2">Objectives:</div>
                          <div className="flex items-center text-sm text-gray-300 mb-2">
                            <span className="mr-2">⏱️</span>
                            <span>{challenge.estimatedTime} minutes</span>
                          </div>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {challenge.objectives.slice(0, 2).map((objective, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2 text-purple-400">•</span>
                                {objective}
                              </li>
                            ))}
                            {challenge.objectives.length > 2 && (
                              <li className="text-purple-400 text-xs">
                                +{challenge.objectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        </div>

                        {challenge.impact && (
                          <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <div className="text-xs text-blue-400 font-medium mb-1">Impact:</div>
                            <div className="text-xs text-gray-300 leading-relaxed">{challenge.impact}</div>
                          </div>
                        )}

                        <button
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                            locked 
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 group-hover:scale-105'
                          }`}
                          disabled={locked}
                        >
                          {locked ? 'Locked' : 'Start Challenge'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChallengeLanding;

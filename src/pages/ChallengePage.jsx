import React, { useState } from 'react';
import ChallengeMode from '../scenes/ChallengeMode';
import ChallengeLanding from '../components/ChallengeLanding';
import challengesData from '../data/challenges.json';
import { useApp } from '../context/AppContext';
import { useProgress } from '../context/ProgressContext';

const ChallengePage = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const { completedChallenges, completeChallenge } = useApp();
  const { completeChallenge: trackChallengeProgress, isUnlocked, getUnlockedChallenges } = useProgress();

  const unlockedChallenges = getUnlockedChallenges();

  const handleChallengeComplete = async (result) => {
    console.log('Challenge completed! Result:', result);
    
    try {
      completeChallenge(result.challengeId);
      console.log('Calling trackChallengeProgress...');
      await trackChallengeProgress(result.challengeId);
      console.log('trackChallengeProgress finished successfully');
      setSelectedChallenge(null);
    } catch (error) {
      console.error('Error completing challenge:', error);
      setSelectedChallenge(null);
    }
  };

  const handleExitChallenge = () => {
    setSelectedChallenge(null);
  };

  if (selectedChallenge) {
    return (
      <ChallengeMode
        challenge={selectedChallenge}
        onComplete={handleChallengeComplete}
        onExit={handleExitChallenge}
      />
    );
  }

  const getChallengesByCategory = () => {
    const categories = {};
    challengesData.challenges.forEach(challenge => {
      if (!categories[challenge.category]) {
        categories[challenge.category] = [];
      }
      categories[challenge.category].push(challenge);
    });
    return categories;
  };

  const categorizedChallenges = getChallengesByCategory();
  return (
    <ChallengeLanding 
      challengesData={challengesData}
      completedChallenges={completedChallenges}
      categorizedChallenges={categorizedChallenges}
      setSelectedChallenge={setSelectedChallenge}
      isUnlocked={isUnlocked}
    />
  );
};

export default ChallengePage;

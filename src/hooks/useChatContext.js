import { useScene } from '../context/SceneContext';
import { useProgress } from '../context/ProgressContext';

export const useChatContext = () => {
  let sceneContext, progressContext;
  
  try {
    sceneContext = useScene();
  } catch (e) {
    sceneContext = null;
  }
  
  try {
    progressContext = useProgress();
  } catch (e) {
    progressContext = null;
  }

  const getCurrentContext = () => {
    const context = {
      timestamp: new Date().toISOString()
    };

    // Add scene information if available
    if (sceneContext?.state?.objects) {
      context.scene = {
        objectCount: sceneContext.state.objects.length,
        objectTypes: sceneContext.state.objects.map(obj => obj.type),
        selectedObject: sceneContext.state.selectedObject?.type || null
      };
    }

    // Add progress information if available
    if (progressContext?.currentChallenge) {
      context.challenge = {
        id: progressContext.currentChallenge.id,
        title: progressContext.currentChallenge.title,
        difficulty: progressContext.currentChallenge.difficulty
      };
    }

    if (progressContext?.progress) {
      context.progress = {
        completedChallenges: progressContext.progress.completedChallenges?.length || 0,
        currentLevel: progressContext.progress.currentLevel || 'beginner'
      };
    }

    return context;
  };

  return { getCurrentContext };
};

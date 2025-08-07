import { useState, useCallback } from 'react';

export interface UseWizardProps {
  totalSteps: number;
  initialStep?: number;
  onComplete?: (data?: any) => Promise<void> | void;
  onStepChange?: (currentStep: number, previousStep: number) => void;
}

export interface UseWizardReturn {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  completedSteps: Set<number>;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  markStepCompleted: (step: number) => void;
  isStepCompleted: (step: number) => boolean;
}

export function useWizard({
  totalSteps,
  initialStep = 0,
  onComplete,
  onStepChange,
}: UseWizardProps): UseWizardReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      const previousStep = currentStep;
      setCurrentStep(step);
      onStepChange?.(step, previousStep);
    }
  }, [currentStep, totalSteps, onStepChange]);

  const nextStep = useCallback(async () => {
    if (isLastStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      await onComplete?.();
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      goToStep(currentStep + 1);
    }
  }, [isLastStep, currentStep, onComplete, goToStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  }, [isFirstStep, currentStep, goToStep]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps(new Set());
  }, [initialStep]);

  const markStepCompleted = useCallback((step: number) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  const isStepCompleted = useCallback((step: number) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    completedSteps,
    goToStep,
    nextStep,
    prevStep,
    reset,
    markStepCompleted,
    isStepCompleted,
  };
}
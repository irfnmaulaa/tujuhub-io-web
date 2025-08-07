import { type WizardStep } from './../design-system/form/Wizard';
import { useState, useCallback } from 'react'; 

export interface UseWizardProps {
  steps: WizardStep[];
  initialStep?: number;
  onComplete?: (data: Record<string, any>) => void;
  onStepChange?: (step: number, data: Record<string, any>) => void;
  onValidate?: (step: number, data: Record<string, any>) => Promise<boolean>;
}

export interface UseWizardReturn {
  currentStep: number;
  steps: WizardStep[];
  data: Record<string, any>;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToStep: (step: number) => Promise<void>;
  nextStep: () => Promise<void>;
  previousStep: () => Promise<void>;
  updateStepData: (stepId: string, stepData: any) => void;
  updateStepValidity: (stepId: string, isValid: boolean) => void;
  complete: () => void;
  reset: () => void;
}

export const useWizard = ({
  steps: initialSteps,
  initialStep = 0,
  onComplete,
  onStepChange,
  onValidate,
}: UseWizardProps): UseWizardReturn => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [steps, setSteps] = useState(initialSteps);
  const [data, setData] = useState<Record<string, any>>({});

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToStep = useCallback(async (step: number) => {
    if (step >= 0 && step < steps.length) {
      if (onValidate) {
        const isValid = await onValidate(currentStep, data);
        if (!isValid) return;
      }
      setCurrentStep(step);
      onStepChange?.(step, data);
    }
  }, [steps.length, onStepChange, data, currentStep, onValidate]);

  const nextStep = useCallback(async () => {
    if (!isLastStep) {
      await goToStep(currentStep + 1);
    }
  }, [currentStep, isLastStep, goToStep]);

  const previousStep = useCallback(async () => {
    if (!isFirstStep) {
      await goToStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, goToStep]);

  const updateStepData = useCallback((stepId: string, stepData: any) => {
    setData(prev => ({
      ...prev,
      [stepId]: stepData,
    }));
  }, []);

  const updateStepValidity = useCallback((stepTitle: string, isValid: boolean) => {
    setSteps(prev => prev.map(step => 
      step.title === stepTitle ? { ...step, isValid } : step
    ));
  }, []);

  const complete = useCallback(() => {
    onComplete?.(data);
  }, [onComplete, data]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setData({});
    setSteps(initialSteps);
  }, [initialStep, initialSteps]);

  return {
    currentStep,
    steps,
    data,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    previousStep,
    updateStepData,
    updateStepValidity,
    complete,
    reset,
  };
};
import React, { useState, useCallback } from 'react';
import { CardBody, CardHeader, Progress, Divider } from '@heroui/react';
import Button from '@/shared/design-system/button/Button'; 
import { TbCheck, TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import Card from '../card/Card';

export interface WizardStep {
  title: string;
  description?: string;
  content: React.ReactNode;
  validation?: () => Promise<boolean> | boolean;
  isOptional?: boolean;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete: (data?: any) => Promise<void> | void;
  onStepChange?: (currentStep: number, previousStep: number) => void;
  className?: string;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  allowSkipOptional?: boolean;
  
  // Customizable buttons
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  completeButton?: React.ReactNode;
  
  // Button props for default buttons
  prevButtonProps?: any;
  nextButtonProps?: any;
  completeButtonProps?: any;
  
  // Loading states
  isLoading?: boolean;
  isValidating?: boolean;
}

export interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  goToStep: (step: number) => Promise<void>;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  reset: () => void;
  completedSteps: Set<number>;
}

const WizardContext = React.createContext<WizardContextType | null>(null);

export function useWizardContext() {
  const context = React.useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext must be used within a Wizard component');
  }
  return context;
}

export default function Wizard({
  steps,
  onComplete,
  onStepChange,
  className = '',
  showProgress = true,
  showStepNumbers = true,
  prevButton,
  nextButton,
  completeButton,
  prevButtonProps = {},
  nextButtonProps = {},
  completeButtonProps = {},
  isLoading = false,
  isValidating = false,
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepData = steps[currentStep];

  const validateStep = useCallback(async (stepIndex: number): Promise<boolean> => {
    const step = steps[stepIndex];
    if (!step.validation) return true;

    try {
      const isValid = await step.validation();
      if (isValid) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[stepIndex];
          return newErrors;
        });
        return true;
      } else {
        setValidationErrors(prev => ({
          ...prev,
          [stepIndex]: 'Please complete all required fields before proceeding.'
        }));
        return false;
      }
    } catch (error) {
      setValidationErrors(prev => ({
        ...prev,
        [stepIndex]: error instanceof Error ? error.message : 'Validation failed'
      }));
      return false;
    }
  }, [steps]);

  const goToStep = useCallback(async (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= totalSteps) return;
    
    // If going forward, validate current step
    if (stepIndex > currentStep) {
      const isValid = await validateStep(currentStep);
      if (!isValid && !currentStepData.isOptional) return;
    }

    const previousStep = currentStep;
    setCurrentStep(stepIndex);
    
    // Mark previous step as completed if moving forward
    if (stepIndex > previousStep) {
      setCompletedSteps(prev => new Set([...prev, previousStep]));
    }
    
    onStepChange?.(stepIndex, previousStep);
  }, [currentStep, totalSteps, validateStep, currentStepData, onStepChange]);

  const nextStep = useCallback(async () => {
    if (isLastStep) {
      // Validate current step before completing
      const isValid = await validateStep(currentStep);
      if (isValid || currentStepData.isOptional) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        await onComplete();
      }
    } else {
      await goToStep(currentStep + 1);
    }
  }, [isLastStep, currentStep, validateStep, currentStepData, onComplete, goToStep]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1, currentStep);
    }
  }, [isFirstStep, currentStep, onStepChange]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setValidationErrors({});
  }, []);

  const contextValue: WizardContextType = {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    canGoNext: !isValidating && !isLoading,
    canGoPrev: !isFirstStep && !isValidating && !isLoading,
    goToStep,
    nextStep,
    prevStep,
    reset,
    completedSteps,
  };

  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  // Default buttons
  const defaultPrevButton = (
    <Button
      variant="flat"
      color="default"
      startContent={<TbChevronLeft className="w-4 h-4" />}
      onPress={prevStep}
      isDisabled={!contextValue.canGoPrev}
      {...prevButtonProps}
    >
      Previous
    </Button>
  );

  const defaultNextButton = (
    <Button
      color="primary"
      endContent={isLastStep ? <TbCheck className="w-4 h-4" /> : <TbChevronRight className="w-4 h-4" />}
      onPress={nextStep}
      isDisabled={!contextValue.canGoNext}
      isLoading={isValidating || isLoading}
      {...(isLastStep ? completeButtonProps : nextButtonProps)}
    >
      {isLastStep ? 'Complete' : 'Next'}
    </Button>
  );

  return (
    <WizardContext.Provider value={contextValue}>
      <div className={`wizard-container ${className}`}>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progressValue)}% Complete
              </span>
            </div>
            <Progress 
              value={progressValue} 
              color="primary" 
              className="mb-4"
            />
          </div>
        )}

        {/* Step Indicators */}
        {showStepNumbers && (
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.has(index);
                const isCurrent = index === currentStep;
                const isAccessible = index <= currentStep || completedSteps.has(index);
                
                return (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => isAccessible && goToStep(index)}
                      disabled={!isAccessible || isValidating || isLoading}
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors
                        ${isCurrent 
                          ? 'bg-primary text-white' 
                          : isCompleted 
                            ? 'bg-success text-white' 
                            : isAccessible 
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <TbCheck className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ${
                        isCompleted ? 'bg-success' : 'bg-gray-200'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card className="mb-6 border border-default-200">
          <CardHeader className="pb-2">
            <div>
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              {currentStepData.description && (
                <p className="text-sm text-gray-600 mt-1">{currentStepData.description}</p>
              )}
              {currentStepData.isOptional && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-2">
                  Optional
                </span>
              )}
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {currentStepData.content}
            
            {/* Validation Error */}
            {validationErrors[currentStep] && (
              <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-700">{validationErrors[currentStep]}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {!isFirstStep && (prevButton || defaultPrevButton)}
          </div>
          <div>
            {isLastStep 
              ? (completeButton || defaultNextButton)
              : (nextButton || defaultNextButton)
            }
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
}
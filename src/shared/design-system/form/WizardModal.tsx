import React from 'react';
import { ModalElement } from '@/shared/hooks/useModal';
import Wizard, { type WizardProps, type WizardStep } from './Wizard';
import Button from '@/shared/design-system/button/Button';
import { type UseDisclosureProps } from '@heroui/react';

export interface WizardModalProps extends Omit<WizardProps, 'onComplete'> {
  control: UseDisclosureProps;
  header?: string;
  onComplete: () => Promise<void> | void;
  onCancel?: () => void;
  cancelButtonText?: string;
  completeButtonText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export default function WizardModal({
  control,
  header = 'Setup Wizard',
  onComplete,
  onCancel,
  cancelButtonText = 'Cancel',
  completeButtonText = 'Complete',
  size = 'xl',
  steps,
  ...wizardProps
}: WizardModalProps) { 

  const handleComplete = async () => {
    await onComplete();
    control.onClose?.();
  };  

  return (
    <ModalElement
      control={control}
      header={header}
      size={size} 
      hideCloseButton={false}
    >
      <Wizard
        steps={steps}
        onComplete={handleComplete}  
        {...wizardProps}
      />
      <div></div>
    </ModalElement>
  );
}
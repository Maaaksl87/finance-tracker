import { useState } from "react";

export function useSourceWizard(totalSteps: number, initialStep: number = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const goNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const goBack = () => {
    if (currentStep > initialStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const reset = () => {
    setCurrentStep(initialStep);
  };

  const isFirstStep = currentStep === initialStep;
  const isLastStep = currentStep === totalSteps;

  return { currentStep, goNext, goBack, reset, isFirstStep, isLastStep };
}

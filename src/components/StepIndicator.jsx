import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Enter Content' },
    { number: 2, label: 'Configure Options' },
    { number: 3, label: 'Generate & Copy' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div 
          key={step.number} 
          className={`step ${currentStep >= step.number ? 'active' : ''}`}
        >
          <div className="step-number">{step.number}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
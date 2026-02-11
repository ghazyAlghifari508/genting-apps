'use client'

import React from 'react'

export interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 rounded transition-colors ${
                step < currentStep ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

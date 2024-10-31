import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Info } from 'lucide-react';

interface WaterIntakeTrackerProps {
  defaultGoal?: number; // in fluid oz
}

export function WaterIntakeTracker({ defaultGoal = 64 }: WaterIntakeTrackerProps) {
  const [goal] = useState(defaultGoal);
  const [intake, setIntake] = useState(() => {
    const saved = localStorage.getItem('waterIntake');
    return saved ? parseInt(saved) : 0;
  });
  const [showReminder, setShowReminder] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    localStorage.setItem('waterIntake', intake.toString());
  }, [intake]);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      setIntake(0);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleStartNewDay = () => {
      setIntake(0);
    };

    window.addEventListener('startNewDay', handleStartNewDay);
    return () => window.removeEventListener('startNewDay', handleStartNewDay);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (intake < goal) {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 5000);
      }
    }, 3600000);

    return () => clearInterval(interval);
  }, [intake, goal]);

  const addWater = (amount: number) => {
    setIntake(prev => Math.min(prev + amount, goal));
  };

  const removeWater = (amount: number) => {
    setIntake(prev => Math.max(prev - amount, 0));
  };

  const progress = (intake / goal) * 100;
  const remaining = goal - intake;
  const glassesRemaining = Math.ceil(remaining / 8);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <h2 className="text-lg font-semibold">Water Intake</h2>
        <div className="relative ml-auto">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)} // For mobile touch
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <Info className="w-4 h-4" />
          </button>
          {showTooltip && (
            <div className="absolute right-0 w-48 p-2 mt-2 text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              Following the 8x8 rule: Drink eight 8-ounce glasses (64 oz total) of water daily for optimal hydration.
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Water bottle visualization */}
        <div className="relative h-48 w-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-6 rounded-t-lg border-2 border-blue-200 dark:border-blue-900" />
          
          <div className="absolute top-6 left-0 right-0 h-40 rounded-b-2xl border-2 border-blue-200 dark:border-blue-900 overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 right-0 bg-blue-500/20 transition-all duration-500 ease-out"
              style={{ height: `${progress}%` }}
            >
              <div className="absolute inset-0 animate-wave bg-gradient-to-b from-blue-400/40 to-blue-500/40">
                <div className="absolute inset-0 animate-wave-reverse bg-gradient-to-t from-blue-400/20 to-transparent" />
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium">
                {Math.round(progress)}%
              </span>
            </div>

            {[75, 50, 25].map((marker) => (
              <div
                key={marker}
                className="absolute left-0 w-2 h-px bg-blue-200 dark:bg-blue-900"
                style={{ bottom: `${marker}%` }}
              />
            ))}
          </div>
        </div>

        <div className="w-full sm:flex-1 space-y-4">
          {/* Quick add buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[8, 16, 24].map(amount => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="px-2 py-2 sm:py-1 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                +{amount}oz
              </button>
            ))}
          </div>

          {/* Manual adjustment */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => removeWater(2)}
              className="p-2 sm:p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-medium">
              {intake}oz / {goal}oz
            </span>
            <button
              onClick={() => addWater(2)}
              className="p-2 sm:p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Remaining intake */}
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {remaining > 0 ? (
              <>
                <div>{remaining}oz to go</div>
                <div className="text-xs mt-1">
                  ({glassesRemaining} glass{glassesRemaining !== 1 ? 'es' : ''} remaining)
                </div>
              </>
            ) : (
              <span className="text-green-500 dark:text-green-400">Goal reached! 🎉</span>
            )}
          </div>
        </div>
      </div>

      {/* Hydration reminder */}
      {showReminder && (
        <div className="mt-3 text-sm text-blue-600 dark:text-blue-400 text-center animate-pulse">
          Time for a water break! 💧
        </div>
      )}
    </div>
  );
}
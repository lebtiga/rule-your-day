import React from 'react';
import { Clock } from 'lucide-react';
import { TimeBlock } from '../types';

interface TimeDistributionProps {
  blocks: TimeBlock[];
}

export function TimeDistribution({ blocks }: TimeDistributionProps) {
  const getTotalTimeByCategory = () => {
    const totals: Record<string, number> = {};
    blocks.forEach(block => {
      totals[block.category] = (totals[block.category] || 0) + block.duration;
    });
    return totals;
  };

  const totals = getTotalTimeByCategory();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold">Time Distribution</h2>
      </div>
      <div className="space-y-3">
        {Object.entries(totals).map(([category, minutes]) => (
          <div key={category} className="flex items-center gap-2">
            <div className="w-24 text-sm text-gray-600 dark:text-gray-400 capitalize">{category}</div>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  category === 'work' ? 'bg-blue-500' :
                  category === 'self-care' ? 'bg-green-500' :
                  category === 'family' ? 'bg-purple-500' :
                  category === 'health' ? 'bg-red-500' :
                  category === 'social' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}
                style={{ width: `${(minutes / (Object.values(totals).reduce((a, b) => a + b, 0) || 1)) * 100}%` }}
              />
            </div>
            <div className="w-16 text-sm text-right text-gray-600 dark:text-gray-400">
              {Math.round(minutes / 60 * 10) / 10}h
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
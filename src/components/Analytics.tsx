import React from 'react';
import { TimeBlock, PriorityTask } from '../types';
import { Gauge } from 'lucide-react';
import { CircularProgress } from './CircularProgress';
import { TimeDistribution } from './TimeDistribution';

interface AnalyticsProps {
  blocks: TimeBlock[];
  tasks?: PriorityTask[];
}

export function Analytics({ blocks, tasks = [] }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Gauge className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-semibold">Progress Pulse</h2>
        </div>
        <CircularProgress tasks={tasks} blocks={blocks} />
      </div>
      <TimeDistribution blocks={blocks} />
    </div>
  );
}
import React from 'react';
import { DailyGoal } from '../types';
import { Target, Check, Plus } from 'lucide-react';

interface GoalTrackerProps {
  goals: DailyGoal[];
  onGoalToggle: (id: string) => void;
  onGoalAdd: (title: string) => void;
}

export function GoalTracker({ goals, onGoalToggle, onGoalAdd }: GoalTrackerProps) {
  const [newGoal, setNewGoal] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onGoalAdd(newGoal.trim());
      setNewGoal('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Daily Goals</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <button
              onClick={() => onGoalToggle(goal.id)}
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                goal.completed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
              }`}
            >
              {goal.completed && <Check className="w-4 h-4" />}
            </button>
            <span className={`flex-1 ${goal.completed ? 'line-through text-gray-500' : ''}`}>
              {goal.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
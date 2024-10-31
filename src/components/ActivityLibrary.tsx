import React from 'react';
import { Activity, Category } from '../types';
import { Library, Plus } from 'lucide-react';

interface ActivityLibraryProps {
  activities: Activity[];
  onActivityAdd: (activity: Omit<Activity, 'id'>) => void;
}

export function ActivityLibrary({ activities, onActivityAdd }: ActivityLibraryProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [newActivity, setNewActivity] = React.useState({
    title: '',
    category: 'work' as Category,
    duration: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.title.trim()) {
      onActivityAdd(newActivity);
      setNewActivity({ title: '', category: 'work', duration: 30 });
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Library className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Activity Library</h2>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Name
              </label>
              <input
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter activity name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newActivity.category}
                onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as Category })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="work">Work</option>
                <option value="self-care">Self-care</option>
                <option value="family">Family</option>
                <option value="health">Health</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="5"
                step="5"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add Activity
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activities.map(activity => (
          <div
            key={activity.id}
            className={`p-3 rounded-lg cursor-move ${
              activity.category === 'work' ? 'bg-blue-50 border-blue-200' :
              activity.category === 'self-care' ? 'bg-green-50 border-green-200' :
              activity.category === 'family' ? 'bg-purple-50 border-purple-200' :
              activity.category === 'health' ? 'bg-red-50 border-red-200' :
              activity.category === 'social' ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            } border`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('activityId', activity.id);
            }}
          >
            <h3 className="font-medium">{activity.title}</h3>
            <div className="text-sm text-gray-600 mt-1">
              {activity.duration} minutes
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
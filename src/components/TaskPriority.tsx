import React, { useState } from 'react';
import { PriorityTask, Category } from '../types';
import { Star, CheckCircle2, Circle, Edit2, X, Plus, Trash2 } from 'lucide-react';

interface TaskPriorityProps {
  tasks: PriorityTask[];
  onTaskToggle: (id: string) => void;
  onTaskUpdate: (id: string, updates: Partial<PriorityTask>) => void;
  onTaskDelete: (id: string) => void;
  onTaskAdd: (task: Omit<PriorityTask, 'id'>) => void;
}

export function TaskPriority({ tasks, onTaskToggle, onTaskUpdate, onTaskDelete, onTaskAdd }: TaskPriorityProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingTopPriority, setIsAddingTopPriority] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'work' as Category,
    completed: false,
    isTopPriority: false,
  });

  const categories: Category[] = ['work', 'self-care', 'family', 'health', 'social', 'other'];
  const topTasks = tasks.filter(task => task.isTopPriority);
  const secondaryTasks = tasks.filter(task => !task.isTopPriority);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      onTaskAdd(newTask);
      setNewTask({
        title: '',
        category: 'work',
        completed: false,
        isTopPriority: false,
      });
      setIsAddingTask(false);
      setIsAddingTopPriority(false);
    }
  };

  const TaskSection = ({ title, tasks, icon }: { title: string; tasks: PriorityTask[]; icon: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`group flex items-center gap-3 p-3 rounded-lg transition-colors ${
              task.category === 'work' ? 'bg-blue-50 dark:bg-blue-900/20' :
              task.category === 'self-care' ? 'bg-green-50 dark:bg-green-900/20' :
              task.category === 'family' ? 'bg-purple-50 dark:bg-purple-900/20' :
              task.category === 'health' ? 'bg-red-50 dark:bg-red-900/20' :
              task.category === 'social' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
              'bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <button
              onClick={() => onTaskToggle(task.id)}
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {task.completed ? 
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" /> : 
                <Circle className="w-5 h-5" />
              }
            </button>
            
            {editingId === task.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setEditingId(null);
              }} className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => onTaskUpdate(task.id, { title: e.target.value })}
                  className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <select
                  value={task.category}
                  onChange={(e) => onTaskUpdate(task.id, { category: e.target.value as Category })}
                  className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="p-1 text-green-500 hover:text-green-600 dark:text-green-400"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <>
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingId(task.id)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {title === "Top Priority" && (
          <button
            onClick={() => {
              setNewTask(prev => ({ ...prev, isTopPriority: true }));
              setIsAddingTopPriority(true);
            }}
            className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Top Priority Task
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {(isAddingTask || isAddingTopPriority) && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter task title"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Category })}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingTask(false);
                  setIsAddingTopPriority(false);
                  setNewTask({
                    title: '',
                    category: 'work',
                    completed: false,
                    isTopPriority: false,
                  });
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <TaskSection 
          title="Top Priority" 
          tasks={topTasks} 
          icon={<Star className="w-5 h-5 text-amber-500" />} 
        />
        <TaskSection 
          title="Secondary Tasks" 
          tasks={secondaryTasks} 
          icon={<CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />} 
        />
      </div>

      {!isAddingTask && !isAddingTopPriority && (
        <button
          onClick={() => {
            setNewTask(prev => ({ ...prev, isTopPriority: false }));
            setIsAddingTask(true);
          }}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </button>
      )}
    </div>
  );
}
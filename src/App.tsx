import React, { useState, useEffect } from 'react';
import { LayoutGrid, Moon, Sun, RefreshCw } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { TaskPriority } from './components/TaskPriority';
import { Analytics } from './components/Analytics';
import { DigitalClock } from './components/DigitalClock';
import { QuoteDisplay } from './components/QuoteDisplay';
import { WaterIntakeTracker } from './components/WaterIntakeTracker';
import { Footer } from './components/Footer';
import { TimeBlock, PriorityTask } from './types';

export function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [tasks, setTasks] = useState<PriorityTask[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [blocks, setBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('blocks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('blocks', JSON.stringify(blocks));
  }, [blocks]);

  const getTaskCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (taskId: string, updates: Partial<PriorityTask>) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const addTask = (newTask: Omit<PriorityTask, 'id'>) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const handleBlockDrop = (blockId: string, hour: number) => {
    setBlocks(blocks.map(block =>
      block.id === blockId
        ? { ...block, startTime: `${hour.toString().padStart(2, '0')}:00` }
        : block
    ));
  };

  const handleBlockAdd = (block: Omit<TimeBlock, 'id'>) => {
    setBlocks([...blocks, { ...block, id: Date.now().toString() }]);
  };

  const handleBlockComplete = (blockId: string) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, completed: !block.completed } : block
    ));
  };

  const handleBlockUpdate = (blockId: string, updates: Partial<TimeBlock>) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const startNewDay = () => {
    if (window.confirm('Are you sure you want to start a new day? This will clear all tasks and time blocks.')) {
      setTasks([]);
      setBlocks([]);
      window.dispatchEvent(new Event('startNewDay'));
    }
  };

  const completionRate = getTaskCompletionRate();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 flex-1 text-gray-900 dark:text-gray-100">
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-xl font-bold">Rule Your Day</h1>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={startNewDay}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Start New Day
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    {formatDate(new Date())}
                  </span>
                  <DigitalClock />
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Task Progress
              </div>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {completionRate}%
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TaskPriority
                tasks={tasks}
                onTaskToggle={toggleTaskCompletion}
                onTaskUpdate={updateTask}
                onTaskDelete={deleteTask}
                onTaskAdd={addTask}
              />
              <Timeline
                blocks={blocks}
                onBlockDrop={handleBlockDrop}
                onBlockAdd={handleBlockAdd}
                onBlockComplete={handleBlockComplete}
                onBlockUpdate={handleBlockUpdate}
                onBlockDelete={handleBlockDelete}
              />
            </div>
            <div className="space-y-6">
              <Analytics blocks={blocks} tasks={tasks} />
              <WaterIntakeTracker />
              <QuoteDisplay />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { TimeBlock, Category } from '../types';
import { Clock, Plus, X, CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';

interface TimelineProps {
  blocks: TimeBlock[];
  onBlockDrop: (blockId: string, hour: number) => void;
  onBlockAdd: (block: Omit<TimeBlock, 'id'>) => void;
  onBlockComplete?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<TimeBlock>) => void;
  onBlockDelete?: (blockId: string) => void;
}

export function Timeline({ 
  blocks, 
  onBlockDrop, 
  onBlockAdd, 
  onBlockComplete,
  onBlockUpdate,
  onBlockDelete 
}: TimelineProps) {
  const hours = [...Array(24)].map((_, i) => (i + 4) % 24);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState({
    title: '',
    category: 'work' as Category,
    duration: 60,
    completed: false,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('blockId');
    if (blockId) {
      onBlockDrop(blockId, hour);
    }
  };

  const handleAddBlock = (hour: number) => {
    setSelectedHour(hour);
    setShowAddForm(true);
    setNewBlock(prev => ({
      ...prev,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlock.title && selectedHour !== null) {
      onBlockAdd({
        ...newBlock,
        startTime: `${selectedHour.toString().padStart(2, '0')}:00`,
      });
      setShowAddForm(false);
      setNewBlock({
        title: '',
        category: 'work',
        duration: 60,
        completed: false,
      });
    }
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<TimeBlock>) => {
    onBlockUpdate?.(blockId, updates);
  };

  const handleDeleteBlock = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this block?')) {
      onBlockDelete?.(blockId);
    }
  };

  const getBlocksForHour = (hour: number) => {
    return blocks.filter(block => {
      const startHour = parseInt(block.startTime.split(':')[0]);
      const endHour = startHour + Math.ceil(block.duration / 60);
      return hour >= startHour && hour < endHour;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-semibold">Daily Timeline</h2>
      </div>

      {showAddForm && selectedHour !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Time Block</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter title"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newBlock.category}
                  onChange={(e) => setNewBlock({ ...newBlock, category: e.target.value as Category })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
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
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newBlock.duration}
                  onChange={(e) => setNewBlock({ ...newBlock, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  min="15"
                  step="15"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Block
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {hours.map(hour => {
          const timeBlocks = getBlocksForHour(hour);
          return (
            <div
              key={hour}
              className="flex items-start gap-2"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hour)}
            >
              <span className="w-12 text-sm text-gray-500 dark:text-gray-400">
                {hour.toString().padStart(2, '0')}:00
              </span>
              <div 
                className="flex-1 min-h-[2.5rem] group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors p-2"
                onClick={() => handleAddBlock(hour)}
              >
                {timeBlocks.map(block => (
                  <div
                    key={block.id}
                    className={`flex items-center gap-2 p-2 rounded text-sm mb-1 cursor-move ${
                      block.category === 'work' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' :
                      block.category === 'self-care' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                      block.category === 'family' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200' :
                      block.category === 'health' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                      block.category === 'social' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('blockId', block.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockComplete?.(block.id);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {block.completed ? 
                        <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" /> : 
                        <Circle className="w-4 h-4" />
                      }
                    </button>
                    
                    {editingBlock === block.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setEditingBlock(null);
                        }}
                        className="flex-1 flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={block.title}
                          onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                          className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                          autoFocus
                        />
                        <select
                          value={block.category}
                          onChange={(e) => handleUpdateBlock(block.id, { category: e.target.value as Category })}
                          className="px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                        >
                          <option value="work">Work</option>
                          <option value="self-care">Self-care</option>
                          <option value="family">Family</option>
                          <option value="health">Health</option>
                          <option value="social">Social</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          type="number"
                          value={block.duration}
                          onChange={(e) => handleUpdateBlock(block.id, { duration: parseInt(e.target.value) })}
                          className="w-20 px-2 py-1 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                          min="15"
                          step="15"
                        />
                        <button
                          type="submit"
                          className="p-1 text-green-500 hover:text-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </form>
                    ) : (
                      <>
                        <span className={`flex-1 ${block.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                          {block.title}
                        </span>
                        <span className="text-xs ml-2">({block.duration}m)</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingBlock(block.id);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteBlock(e, block.id)}
                            className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
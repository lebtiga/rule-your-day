export type Category = 'work' | 'self-care' | 'family' | 'health' | 'social' | 'other';

export interface TimeBlock {
  id: string;
  title: string;
  category: Category;
  startTime: string;
  duration: number;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  priority: 'high' | 'low';
}
export type Category = 'work' | 'self-care' | 'family' | 'health' | 'social' | 'other';

export interface TimeBlock {
  id: string;
  title: string;
  category: Category;
  startTime: string;
  duration: number;
  completed: boolean;
}

export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: Category;
  duration: number;
}

export interface RecurringConfig {
  parentId: string | null;
  frequency: 'daily';
  startDate: string;
}

export interface PriorityTask {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  isTopPriority: boolean;
  recurring?: RecurringConfig;
}
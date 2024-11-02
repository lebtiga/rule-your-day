export type Category = 'work' | 'self-care' | 'family' | 'health' | 'social' | 'other';

export interface RecurringConfig {
  parentId: string | null;
  frequency: 'daily';
  startDate: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  category: Category;
  startTime: string;
  duration: number;
  completed: boolean;
  recurring?: RecurringConfig;
}
export interface StudyTask {
  id: string;
  subject: string;
  reminderDate: string;
  duration: number;
  priority: Priority;
  notes: string;
  completed: boolean;
  createdAt: string;
  categoryId?: string;
  points?: number;
}

export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface StudyStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyTime: number;
  completionRate: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
}
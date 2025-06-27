export interface StudyTask {
  id: string;
  subject: string;
  reminderDate: string;
  duration: number; // in minutes
  priority: Priority;
  notes: string;
  completed: boolean;
  createdAt: string;
  repeatType: RepeatType;
}

export type Priority = 'high' | 'medium' | 'low';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface StudyStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyTime: number; // in minutes
}
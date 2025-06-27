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
  categoryId?: string;
  attachments?: Attachment[];
  studyNotes?: string;
  actualDuration?: number;
  points?: number;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'link' | 'note';
  content: string;
  createdAt: string;
}

export type Priority = 'high' | 'medium' | 'low';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface StudyStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalStudyTime: number; // in minutes
  averageStudyTime: number;
  completionRate: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
}

export interface StudySession {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  notes?: string;
  completed: boolean;
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyTask, Priority, RepeatType, StudySession, Attachment } from '@/types/StudyTask';
import { useNotificationContext } from './NotificationContext';
import { useGoals } from './GoalsContext';

interface StudyContextType {
  tasks: StudyTask[];
  sessions: StudySession[];
  userLevel: number;
  totalPoints: number;
  addTask: (task: Omit<StudyTask, 'id' | 'completed' | 'createdAt' | 'points'>) => void;
  updateTask: (taskId: string, updates: Partial<StudyTask>) => void;
  completeTask: (taskId: string, actualDuration?: number) => void;
  deleteTask: (taskId: string) => void;
  clearAllTasks: () => void;
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
  addAttachment: (taskId: string, attachment: Omit<Attachment, 'id' | 'createdAt'>) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  startStudySession: (taskId: string) => string;
  endStudySession: (sessionId: string, notes?: string) => void;
  loading: boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEY = '@study_tasks';
const SESSIONS_KEY = '@study_sessions';
const USER_STATS_KEY = '@user_stats';

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const { scheduleNotification, cancelNotification } = useNotificationContext();
  const { updateGoalProgress } = useGoals();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedTasks, storedSessions, storedStats] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SESSIONS_KEY),
        AsyncStorage.getItem(USER_STATS_KEY),
      ]);

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
      if (storedStats) {
        const stats = JSON.parse(storedStats);
        setUserLevel(stats.level || 1);
        setTotalPoints(stats.points || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (newTasks: StudyTask[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const saveSessions = async (newSessions: StudySession[]) => {
    try {
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const saveUserStats = async (level: number, points: number) => {
    try {
      const stats = { level, points };
      await AsyncStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
      setUserLevel(level);
      setTotalPoints(points);
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  };

  const calculatePoints = (task: StudyTask, actualDuration?: number) => {
    let points = 10; // Base points
    
    // Priority bonus
    if (task.priority === 'high') points += 15;
    else if (task.priority === 'medium') points += 10;
    else points += 5;
    
    // Duration bonus
    const duration = actualDuration || task.duration;
    points += Math.floor(duration / 15) * 5;
    
    return points;
  };

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addTask = async (taskData: Omit<StudyTask, 'id' | 'completed' | 'createdAt' | 'points'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      points: 0,
      attachments: [],
    };

    const newTasks = [...tasks, newTask];
    await saveTasks(newTasks);

    // Schedule notification
    scheduleNotification(newTask);

    // Handle repeat tasks
    if (taskData.repeatType !== 'none') {
      scheduleRepeatingTasks(newTask);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<StudyTask>) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveTasks(newTasks);
  };

  const scheduleRepeatingTasks = async (task: StudyTask) => {
    const repeatTasks: StudyTask[] = [];
    const baseDate = new Date(task.reminderDate);
    
    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date(baseDate);
      
      switch (task.repeatType) {
        case 'daily':
          nextDate.setDate(baseDate.getDate() + i);
          break;
        case 'weekly':
          nextDate.setDate(baseDate.getDate() + (i * 7));
          break;
        case 'monthly':
          nextDate.setMonth(baseDate.getMonth() + i);
          break;
      }

      const repeatTask: StudyTask = {
        ...task,
        id: generateId(),
        reminderDate: nextDate.toISOString(),
      };

      repeatTasks.push(repeatTask);
      scheduleNotification(repeatTask);
    }

    const newTasks = [...tasks, ...repeatTasks];
    await saveTasks(newTasks);
  };

  const completeTask = async (taskId: string, actualDuration?: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const points = calculatePoints(task, actualDuration);
    const newTotalPoints = totalPoints + points;
    const newLevel = calculateLevel(newTotalPoints);

    const newTasks = tasks.map(t =>
      t.id === taskId 
        ? { 
            ...t, 
            completed: !t.completed,
            points: t.completed ? 0 : points,
            actualDuration: t.completed ? undefined : actualDuration
          } 
        : t
    );

    await saveTasks(newTasks);
    await saveUserStats(newLevel, t.completed ? totalPoints - points : newTotalPoints);

    // Update goals progress
    const completedTasks = newTasks.filter(t => t.completed).length;
    updateGoalProgress('daily-tasks', completedTasks);

    // Cancel notification if task is completed
    if (!task.completed) {
      cancelNotification(taskId);
    }
  };

  const deleteTask = async (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(newTasks);
    cancelNotification(taskId);
  };

  const clearAllTasks = async () => {
    await saveTasks([]);
    tasks.forEach(task => cancelNotification(task.id));
  };

  const addAttachment = async (taskId: string, attachmentData: Omit<Attachment, 'id' | 'createdAt'>) => {
    const newAttachment: Attachment = {
      ...attachmentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          attachments: [...(task.attachments || []), newAttachment],
        };
      }
      return task;
    });

    await saveTasks(newTasks);
  };

  const removeAttachment = async (taskId: string, attachmentId: string) => {
    const newTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          attachments: task.attachments?.filter(att => att.id !== attachmentId) || [],
        };
      }
      return task;
    });

    await saveTasks(newTasks);
  };

  const startStudySession = (taskId: string): string => {
    const sessionId = generateId();
    const newSession: StudySession = {
      id: sessionId,
      taskId,
      startTime: new Date().toISOString(),
      duration: 0,
      completed: false,
    };

    const newSessions = [...sessions, newSession];
    saveSessions(newSessions);
    return sessionId;
  };

  const endStudySession = async (sessionId: string, notes?: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));

    const newSessions = sessions.map(s =>
      s.id === sessionId
        ? {
            ...s,
            endTime: endTime.toISOString(),
            duration,
            notes,
            completed: true,
          }
        : s
    );

    await saveSessions(newSessions);
  };

  const exportData = async () => {
    try {
      const dataToExport = {
        tasks,
        sessions,
        userStats: { level: userLevel, points: totalPoints },
        exportDate: new Date().toISOString(),
        version: '2.0.0',
      };
      
      await AsyncStorage.setItem('@study_backup', JSON.stringify(dataToExport));
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const importData = async () => {
    try {
      const backupData = await AsyncStorage.getItem('@study_backup');
      if (backupData) {
        const parsed = JSON.parse(backupData);
        if (parsed.tasks) {
          await saveTasks(parsed.tasks);
        }
        if (parsed.sessions) {
          await saveSessions(parsed.sessions);
        }
        if (parsed.userStats) {
          await saveUserStats(parsed.userStats.level, parsed.userStats.points);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        tasks,
        sessions,
        userLevel,
        totalPoints,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        clearAllTasks,
        exportData,
        importData,
        addAttachment,
        removeAttachment,
        startStudySession,
        endStudySession,
        loading,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudyContext() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
}
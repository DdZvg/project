import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyTask, Priority, RepeatType } from '@/types/StudyTask';
import { useNotificationContext } from './NotificationContext';

interface StudyContextType {
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id' | 'completed' | 'createdAt'>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  clearAllTasks: () => void;
  exportData: () => Promise<void>;
  importData: () => Promise<void>;
  loading: boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEY = '@study_tasks';

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const { scheduleNotification, cancelNotification } = useNotificationContext();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
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

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addTask = async (taskData: Omit<StudyTask, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
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

  const scheduleRepeatingTasks = async (task: StudyTask) => {
    const repeatTasks: StudyTask[] = [];
    const baseDate = new Date(task.reminderDate);
    
    for (let i = 1; i <= 10; i++) { // Create 10 future instances
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

  const completeTask = async (taskId: string) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(newTasks);

    // Cancel notification if task is completed
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
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
    // Cancel all notifications
    tasks.forEach(task => cancelNotification(task.id));
  };

  const exportData = async () => {
    try {
      const dataToExport = {
        tasks,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      
      // In a real app, you would use a file picker or share functionality
      // For now, we'll just save to AsyncStorage with a different key
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
        addTask,
        completeTask,
        deleteTask,
        clearAllTasks,
        exportData,
        importData,
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
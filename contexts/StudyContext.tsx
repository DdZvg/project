import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyTask, Priority, Category } from '@/types/StudyTask';

interface StudyContextType {
  tasks: StudyTask[];
  categories: Category[];
  userLevel: number;
  totalPoints: number;
  loading: boolean;
  addTask: (task: Omit<StudyTask, 'id' | 'completed' | 'createdAt' | 'points'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<StudyTask>) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEY = '@study_tasks';
const CATEGORIES_KEY = '@study_categories';
const USER_STATS_KEY = '@user_stats';

const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Matemáticas', color: '#3b82f6' },
  { name: 'Ciencias', color: '#10b981' },
  { name: 'Historia', color: '#f59e0b' },
  { name: 'Literatura', color: '#8b5cf6' },
];

export function StudyProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedTasks, storedCategories, storedStats] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
        AsyncStorage.getItem(USER_STATS_KEY),
      ]);

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        const initialCategories = defaultCategories.map(cat => ({
          ...cat,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }));
        setCategories(initialCategories);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(initialCategories));
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

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const calculatePoints = (task: StudyTask) => {
    let points = 10;
    if (task.priority === 'high') points += 15;
    else if (task.priority === 'medium') points += 10;
    else points += 5;
    points += Math.floor(task.duration / 15) * 5;
    return points;
  };

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
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

  const addTask = async (taskData: Omit<StudyTask, 'id' | 'completed' | 'createdAt' | 'points'>) => {
    try {
      const newTask: StudyTask = {
        ...taskData,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
        points: 0,
      };

      const newTasks = [...tasks, newTask];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<StudyTask>) => {
    try {
      const newTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const points = task.completed ? 0 : calculatePoints(task);
      const newTotalPoints = task.completed ? totalPoints - (task.points || 0) : totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);

      const newTasks = tasks.map(t =>
        t.id === taskId 
          ? { ...t, completed: !t.completed, points: task.completed ? 0 : points }
          : t
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
      await saveUserStats(newLevel, newTotalPoints);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const newTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      const newCategory: Category = {
        ...categoryData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      const newCategories = [...categories, newCategory];
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const newCategories = categories.filter(category => category.id !== categoryId);
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const clearAllTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setTasks([]);
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        tasks,
        categories,
        userLevel,
        totalPoints,
        loading,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        addCategory,
        deleteCategory,
        clearAllTasks,
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
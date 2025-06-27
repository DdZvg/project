import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  type: 'daily' | 'weekly' | 'monthly';
  category: 'tasks' | 'time' | 'streak';
  createdAt: string;
  deadline: string;
  completed: boolean;
  reward: string;
}

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentValue' | 'completed' | 'createdAt'>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  deleteGoal: (goalId: string) => void;
  completeGoal: (goalId: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

const GOALS_KEY = '@study_goals';

export function GoalsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(GOALS_KEY);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async (newGoals: Goal[]) => {
    try {
      await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'currentValue' | 'completed' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: generateId(),
      currentValue: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const newGoals = [...goals, newGoal];
    await saveGoals(newGoals);
  };

  const updateGoalProgress = async (goalId: string, progress: number) => {
    const newGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: progress };
        if (progress >= goal.targetValue && !goal.completed) {
          updatedGoal.completed = true;
        }
        return updatedGoal;
      }
      return goal;
    });
    await saveGoals(newGoals);
  };

  const deleteGoal = async (goalId: string) => {
    const newGoals = goals.filter(goal => goal.id !== goalId);
    await saveGoals(newGoals);
  };

  const completeGoal = async (goalId: string) => {
    const newGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: true } : goal
    );
    await saveGoals(newGoals);
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoalProgress,
        deleteGoal,
        completeGoal,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
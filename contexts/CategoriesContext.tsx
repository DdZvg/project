import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const CATEGORIES_KEY = '@study_categories';

const defaultCategories: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Matemáticas', color: '#3b82f6', icon: 'calculator' },
  { name: 'Ciencias', color: '#10b981', icon: 'flask' },
  { name: 'Historia', color: '#f59e0b', icon: 'scroll' },
  { name: 'Literatura', color: '#8b5cf6', icon: 'book' },
  { name: 'Idiomas', color: '#ef4444', icon: 'globe' },
  { name: 'Arte', color: '#ec4899', icon: 'palette' },
];

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Initialize with default categories
        const initialCategories = defaultCategories.map(cat => ({
          ...cat,
          id: generateId(),
          createdAt: new Date().toISOString(),
        }));
        await saveCategories(initialCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const saveCategories = async (newCategories: Category[]) => {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const newCategories = [...categories, newCategory];
    await saveCategories(newCategories);
  };

  const updateCategory = async (categoryId: string, updates: Partial<Category>) => {
    const newCategories = categories.map(category =>
      category.id === categoryId ? { ...category, ...updates } : category
    );
    await saveCategories(newCategories);
  };

  const deleteCategory = async (categoryId: string) => {
    const newCategories = categories.filter(category => category.id !== categoryId);
    await saveCategories(newCategories);
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
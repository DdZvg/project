import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudyContext } from '@/contexts/StudyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { HeaderStats } from '@/components/HeaderStats';
import { FilterButtons } from '@/components/FilterButtons';
import { StudyStreak } from '@/components/StudyStreak';
import DrawerLayout from './_layout';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { tasks, completeTask, deleteTask, loading } = useStudyContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const styles = createStyles(theme);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime();
  });

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          }
        }
      ]
    );
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <DrawerLayout>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </DrawerLayout>
    );
  }

  return (
    <DrawerLayout>
      <View style={styles.container}>
        <HeaderStats 
          totalTasks={tasks.length}
          pendingTasks={pendingTasks.length}
          completedTasks={completedTasks.length}
        />

        <View style={styles.content}>
          <StudyStreak />
          
          <FilterButtons 
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </View>

        <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
          {sortedTasks.length === 0 ? (
            <EmptyState 
              title={filter === 'all' ? 'No hay tareas' : 
                     filter === 'pending' ? 'No hay tareas pendientes' : 
                     'No hay tareas completadas'}
              subtitle={filter === 'all' ? 'Comienza agregando tu primera tarea de estudio' :
                       filter === 'pending' ? 'Todas las tareas están completadas' :
                       'Aún no has completado ninguna tarea'}
            />
          ) : (
            sortedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
              />
            ))
          )}
        </ScrollView>
      </View>
    </DrawerLayout>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
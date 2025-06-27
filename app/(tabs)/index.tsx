import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudyContext } from '@/contexts/StudyContext';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { HeaderStats } from '@/components/HeaderStats';
import { FilterButtons } from '@/components/FilterButtons';
import { StudyTask } from '@/types/StudyTask';
import { BookOpen, CircleCheck as CheckCircle2 } from 'lucide-react-native';

export default function HomeScreen() {
  const { tasks, completeTask, deleteTask } = useStudyContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
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
          onPress: () => deleteTask(taskId)
        }
      ]
    );
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <BookOpen size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>StudyReminder</Text>
        </View>
        <Text style={styles.headerSubtitle}>Organiza tu tiempo de estudio</Text>
      </View>

      <HeaderStats 
        totalTasks={tasks.length}
        pendingTasks={pendingTasks.length}
        completedTasks={completedTasks.length}
      />

      <FilterButtons 
        activeFilter={filter}
        onFilterChange={setFilter}
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 4,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
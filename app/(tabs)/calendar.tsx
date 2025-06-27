import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarComponent } from 'react-native-calendars';
import { useStudyContext } from '@/contexts/StudyContext';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { CalendarDays } from 'lucide-react-native';

export default function CalendarScreen() {
  const { tasks, completeTask, deleteTask } = useStudyContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const markedDates = tasks.reduce((acc, task) => {
    const date = task.reminderDate.split('T')[0];
    if (!acc[date]) {
      acc[date] = { marked: true, dotColor: task.completed ? '#10b981' : '#6366f1' };
    }
    return acc;
  }, {} as any);

  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#6366f1',
    };
  }

  const tasksForSelectedDate = tasks.filter(task => 
    task.reminderDate.split('T')[0] === selectedDate
  ).sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime();
  });

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <CalendarDays size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>Calendario</Text>
        </View>
        <Text style={styles.headerSubtitle}>Visualiza tus sesiones de estudio</Text>
      </View>

      <CalendarComponent
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6b7280',
          selectedDayBackgroundColor: '#6366f1',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#6366f1',
          dayTextColor: '#1f2937',
          textDisabledColor: '#d1d5db',
          dotColor: '#6366f1',
          selectedDotColor: '#ffffff',
          arrowColor: '#6366f1',
          monthTextColor: '#1f2937',
          textDayFontFamily: 'Inter-Regular',
          textMonthFontFamily: 'Inter-SemiBold',
          textDayHeaderFontFamily: 'Inter-Medium',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        firstDay={1}
        showWeekNumbers={false}
        hideExtraDays={true}
        hideDayNames={false}
        showSixWeeks={false}
      />

      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>
          Tareas para {new Date(selectedDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        
        <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
          {tasksForSelectedDate.length === 0 ? (
            <EmptyState 
              title="No hay tareas para este día"
              subtitle="Selecciona otro día o agrega una nueva tarea"
            />
          ) : (
            tasksForSelectedDate.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                showDate={false}
              />
            ))
          )}
        </ScrollView>
      </View>
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
  calendar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tasksSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  tasksList: {
    flex: 1,
  },
});
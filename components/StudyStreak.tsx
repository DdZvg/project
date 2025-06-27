import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStudyContext } from '@/contexts/StudyContext';
import { Flame, Calendar } from 'lucide-react-native';

export function StudyStreak() {
  const { tasks } = useStudyContext();

  const calculateStreak = () => {
    const completedTasks = tasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (completedTasks.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < completedTasks.length; i++) {
      const taskDate = new Date(completedTasks[i].createdAt);
      taskDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();
  const thisWeekTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return task.completed && taskDate >= weekStart;
  }).length;

  return (
    <View style={styles.container}>
      <View style={styles.streakCard}>
        <View style={styles.streakIcon}>
          <Flame size={24} color="#f59e0b" />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>Días consecutivos</Text>
        </View>
      </View>

      <View style={styles.weekCard}>
        <View style={styles.weekIcon}>
          <Calendar size={24} color="#6366f1" />
        </View>
        <View style={styles.weekInfo}>
          <Text style={styles.weekNumber}>{thisWeekTasks}</Text>
          <Text style={styles.weekLabel}>Esta semana</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  streakCard: {
    flex: 1,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#92400e',
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#b45309',
  },
  weekCard: {
    flex: 1,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  weekIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekInfo: {
    flex: 1,
  },
  weekNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1e40af',
  },
  weekLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563eb',
  },
});
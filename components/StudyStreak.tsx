import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStudyContext } from '@/contexts/StudyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Flame, Calendar } from 'lucide-react-native';

export function StudyStreak() {
  const { theme } = useTheme();
  const { tasks } = useStudyContext();
  const styles = createStyles(theme);

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
          <Flame size={24} color={theme.colors.warning} />
        </View>
        <View style={styles.streakInfo}>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>Días consecutivos</Text>
        </View>
      </View>

      <View style={styles.weekCard}>
        <View style={styles.weekIcon}>
          <Calendar size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.weekInfo}>
          <Text style={styles.weekNumber}>{thisWeekTasks}</Text>
          <Text style={styles.weekLabel}>Esta semana</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  streakCard: {
    flex: 1,
    backgroundColor: theme.colors.warning + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.warning + '30',
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakInfo: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.warning,
  },
  streakLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.warning,
  },
  weekCard: {
    flex: 1,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  weekIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekInfo: {
    flex: 1,
  },
  weekNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
  },
  weekLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.primary,
  },
});
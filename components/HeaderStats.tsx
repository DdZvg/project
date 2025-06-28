import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { CircleCheck as CheckCircle, Clock, BookOpen } from 'lucide-react-native';

interface HeaderStatsProps {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
}

export function HeaderStats({ totalTasks, pendingTasks, completedTasks }: HeaderStatsProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
          <BookOpen size={20} color={theme.colors.primary} />
        </View>
        <Text style={styles.statNumber}>{totalTasks}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
          <Clock size={20} color={theme.colors.warning} />
        </View>
        <Text style={styles.statNumber}>{pendingTasks}</Text>
        <Text style={styles.statLabel}>Pendientes</Text>
      </View>
      
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
          <CheckCircle size={20} color={theme.colors.success} />
        </View>
        <Text style={styles.statNumber}>{completedTasks}</Text>
        <Text style={styles.statLabel}>Completadas</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
});
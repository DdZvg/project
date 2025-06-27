import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudyContext } from '@/contexts/StudyContext';
import { ChartBar as BarChart3, TrendingUp, Clock, Target, Calendar, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { tasks } = useStudyContext();

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  
  const totalStudyTime = completedTasks.reduce((total, task) => total + task.duration, 0);
  const averageStudyTime = completedTasks.length > 0 ? Math.round(totalStudyTime / completedTasks.length) : 0;
  
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  
  // Estadísticas por prioridad
  const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high').length;
  const mediumPriorityCompleted = completedTasks.filter(task => task.priority === 'medium').length;
  const lowPriorityCompleted = completedTasks.filter(task => task.priority === 'low').length;

  // Estadísticas de la semana actual
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const thisWeekTasks = completedTasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= weekStart;
  });

  const statsCards = [
    {
      title: 'Tasa de Completado',
      value: `${completionRate}%`,
      icon: Target,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: 'Tiempo Total',
      value: `${Math.floor(totalStudyTime / 60)}h ${totalStudyTime % 60}m`,
      icon: Clock,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: 'Promedio por Sesión',
      value: `${averageStudyTime}min`,
      icon: TrendingUp,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: 'Esta Semana',
      value: `${thisWeekTasks.length}`,
      icon: Calendar,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <BarChart3 size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>Estadísticas</Text>
        </View>
        <Text style={styles.headerSubtitle}>Analiza tu progreso de estudio</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {statsCards.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso por Prioridad</Text>
          <View style={styles.priorityStats}>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityIndicator, { backgroundColor: '#dc2626' }]} />
              <Text style={styles.priorityLabel}>Alta</Text>
              <Text style={styles.priorityValue}>{highPriorityCompleted}</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityIndicator, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.priorityLabel}>Media</Text>
              <Text style={styles.priorityValue}>{mediumPriorityCompleted}</Text>
            </View>
            <View style={styles.priorityItem}>
              <View style={[styles.priorityIndicator, { backgroundColor: '#059669' }]} />
              <Text style={styles.priorityLabel}>Baja</Text>
              <Text style={styles.priorityValue}>{lowPriorityCompleted}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <View style={styles.achievementsContainer}>
            {completedTasks.length >= 1 && (
              <View style={styles.achievement}>
                <Award size={20} color="#f59e0b" />
                <Text style={styles.achievementText}>Primera tarea completada</Text>
              </View>
            )}
            {completedTasks.length >= 5 && (
              <View style={styles.achievement}>
                <Award size={20} color="#3b82f6" />
                <Text style={styles.achievementText}>5 tareas completadas</Text>
              </View>
            )}
            {completedTasks.length >= 10 && (
              <View style={styles.achievement}>
                <Award size={20} color="#8b5cf6" />
                <Text style={styles.achievementText}>10 tareas completadas</Text>
              </View>
            )}
            {totalStudyTime >= 60 && (
              <View style={styles.achievement}>
                <Award size={20} color="#10b981" />
                <Text style={styles.achievementText}>1 hora de estudio</Text>
              </View>
            )}
            {completionRate >= 80 && tasks.length >= 5 && (
              <View style={styles.achievement}>
                <Award size={20} color="#dc2626" />
                <Text style={styles.achievementText}>80% de completado</Text>
              </View>
            )}
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 60) / 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  priorityStats: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  priorityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  priorityLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  priorityValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
  },
  achievementsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Clock, BookOpen } from 'lucide-react-native';

interface HeaderStatsProps {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
}

export function HeaderStats({ totalTasks, pendingTasks, completedTasks }: HeaderStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: '#eff6ff' }]}>
          <BookOpen size={20} color="#2563eb" />
        </View>
        <Text style={styles.statNumber}>{totalTasks}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
          <Clock size={20} color="#d97706" />
        </View>
        <Text style={styles.statNumber}>{pendingTasks}</Text>
        <Text style={styles.statLabel}>Pendientes</Text>
      </View>
      
      <View style={styles.stat}>
        <View style={[styles.statIcon, { backgroundColor: '#d1fae5' }]}>
          <CheckCircle size={20} color="#059669" />
        </View>
        <Text style={styles.statNumber}>{completedTasks}</Text>
        <Text style={styles.statLabel}>Completadas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});
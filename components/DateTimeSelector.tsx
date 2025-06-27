import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';

interface DateTimeSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DateTimeSelector({ date, onDateChange }: DateTimeSelectorProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const adjustDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  const adjustTime = (minutes: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha y hora del recordatorio *</Text>
      
      <View style={styles.dateTimeContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={16} color="#6366f1" />
            <Text style={styles.sectionTitle}>Fecha</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustDate(-1)}
            >
              <Text style={styles.adjustButtonText}>Ayer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustDate(1)}
            >
              <Text style={styles.adjustButtonText}>Mañana</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={16} color="#6366f1" />
            <Text style={styles.sectionTitle}>Hora</Text>
          </View>
          <Text style={styles.timeText}>{formatTime(date)}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustTime(-30)}
            >
              <Text style={styles.adjustButtonText}>-30min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adjustButton}
              onPress={() => adjustTime(30)}
            >
              <Text style={styles.adjustButtonText}>+30min</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  dateTimeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
});
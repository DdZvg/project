import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Priority } from '@/types/StudyTask';

interface PrioritySelectorProps {
  priority: Priority;
  onPriorityChange: (priority: Priority) => void;
}

export function PrioritySelector({ priority, onPriorityChange }: PrioritySelectorProps) {
  const priorities: { value: Priority; label: string; color: string }[] = [
    { value: 'high', label: 'Alta', color: '#dc2626' },
    { value: 'medium', label: 'Media', color: '#f59e0b' },
    { value: 'low', label: 'Baja', color: '#059669' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.options}>
        {priorities.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              priority === option.value && styles.selectedOption,
              { borderColor: option.color }
            ]}
            onPress={() => onPriorityChange(option.value)}
          >
            <View style={[styles.indicator, { backgroundColor: option.color }]} />
            <Text style={[
              styles.optionText,
              priority === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  selectedOption: {
    backgroundColor: '#f8fafc',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  selectedOptionText: {
    color: '#1f2937',
  },
});
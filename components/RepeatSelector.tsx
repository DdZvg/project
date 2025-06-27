import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RepeatType } from '@/types/StudyTask';
import { Repeat } from 'lucide-react-native';

interface RepeatSelectorProps {
  repeatType: RepeatType;
  onRepeatChange: (repeatType: RepeatType) => void;
}

export function RepeatSelector({ repeatType, onRepeatChange }: RepeatSelectorProps) {
  const repeatOptions: { value: RepeatType; label: string }[] = [
    { value: 'none', label: 'No repetir' },
    { value: 'daily', label: 'Diariamente' },
    { value: 'weekly', label: 'Semanalmente' },
    { value: 'monthly', label: 'Mensualmente' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Repeat size={16} color="#6366f1" />
        <Text style={styles.label}>Repetir</Text>
      </View>
      
      <View style={styles.options}>
        {repeatOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              repeatType === option.value && styles.selectedOption
            ]}
            onPress={() => onRepeatChange(option.value)}
          >
            <Text style={[
              styles.optionText,
              repeatType === option.value && styles.selectedOptionText
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
});
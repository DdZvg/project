import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FilterButtonsProps {
  activeFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, activeFilter === 'all' && styles.activeButton]}
        onPress={() => onFilterChange('all')}
      >
        <Text style={[styles.buttonText, activeFilter === 'all' && styles.activeButtonText]}>
          Todas
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, activeFilter === 'pending' && styles.activeButton]}
        onPress={() => onFilterChange('pending')}
      >
        <Text style={[styles.buttonText, activeFilter === 'pending' && styles.activeButtonText]}>
          Pendientes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, activeFilter === 'completed' && styles.activeButton]}
        onPress={() => onFilterChange('completed')}
      >
        <Text style={[styles.buttonText, activeFilter === 'completed' && styles.activeButtonText]}>
          Completadas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activeButtonText: {
    color: '#ffffff',
  },
});
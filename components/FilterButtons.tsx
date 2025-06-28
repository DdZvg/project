import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface FilterButtonsProps {
  activeFilter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

export function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  activeButtonText: {
    color: '#ffffff',
  },
});
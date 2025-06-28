import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StudyTask } from '@/types/StudyTask';
import { useTheme } from '@/contexts/ThemeContext';
import { useStudyContext } from '@/contexts/StudyContext';
import { CircleCheck, Circle, Clock, CircleAlert as AlertCircle, Trash2 } from 'lucide-react-native';

interface TaskCardProps {
  task: StudyTask;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showDate?: boolean;
}

export function TaskCard({ task, onComplete, onDelete, showDate = true }: TaskCardProps) {
  const { theme } = useTheme();
  const { categories } = useStudyContext();
  const styles = createStyles(theme);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Media';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = () => {
    return new Date(task.reminderDate) < new Date() && !task.completed;
  };

  const getCategory = () => {
    return categories.find(cat => cat.id === task.categoryId);
  };

  const category = getCategory();

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => onComplete(task.id)}
        >
          {task.completed ? (
            <CircleCheck size={24} color={theme.colors.success} />
          ) : (
            <Circle size={24} color={theme.colors.textSecondary} />
          )}
        </TouchableOpacity>
        
        <View style={styles.taskInfo}>
          <Text style={[styles.subject, task.completed && styles.completedText]}>
            {task.subject}
          </Text>
          
          <View style={styles.metadata}>
            {showDate && (
              <View style={styles.dateTime}>
                <Text style={styles.date}>{formatDate(task.reminderDate)}</Text>
                <Text style={styles.time}>{formatTime(task.reminderDate)}</Text>
              </View>
            )}
            
            <View style={styles.tags}>
              <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>{getPriorityLabel(task.priority)}</Text>
              </View>
              
              <View style={styles.durationTag}>
                <Clock size={12} color={theme.colors.textSecondary} />
                <Text style={styles.durationText}>{task.duration}min</Text>
              </View>

              {category && (
                <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              )}
              
              {isOverdue() && (
                <View style={styles.overdueTag}>
                  <AlertCircle size={12} color={theme.colors.error} />
                  <Text style={styles.overdueText}>Retrasado</Text>
                </View>
              )}
            </View>
          </View>
          
          {task.notes && (
            <Text style={[styles.notes, task.completed && styles.completedText]}>
              {task.notes}
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Trash2 size={18} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedContainer: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkButton: {
    padding: 4,
  },
  taskInfo: {
    flex: 1,
  },
  subject: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  metadata: {
    gap: 8,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.error,
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
  },
});
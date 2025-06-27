import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StudyTask } from '@/types/StudyTask';
import { CircleCheck as CheckCircle2, Circle, Clock, CircleAlert as AlertCircle, Trash2 } from 'lucide-react-native';

interface TaskCardProps {
  task: StudyTask;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showDate?: boolean;
}

export function TaskCard({ task, onComplete, onDelete, showDate = true }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#059669';
      default: return '#6b7280';
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

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => onComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle2 size={24} color="#10b981" />
          ) : (
            <Circle size={24} color="#6b7280" />
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
                <Clock size={12} color="#6b7280" />
                <Text style={styles.durationText}>{task.duration}min</Text>
              </View>
              
              {isOverdue() && (
                <View style={styles.overdueTag}>
                  <AlertCircle size={12} color="#dc2626" />
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
          <Trash2 size={18} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
    backgroundColor: '#f9fafb',
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
    color: '#1f2937',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
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
    color: '#374151',
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
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
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  overdueTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
  },
});
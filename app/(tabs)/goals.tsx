import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGoals } from '@/contexts/GoalsContext';
import { useStudyContext } from '@/contexts/StudyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Target, Plus, Trophy, Calendar, Clock, CircleCheck as CheckCircle2, Trash2 } from 'lucide-react-native';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { goals, addGoal, deleteGoal, completeGoal } = useGoals();
  const { tasks } = useStudyContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    type: 'daily' as 'daily' | 'weekly' | 'monthly',
    category: 'tasks' as 'tasks' | 'time' | 'streak',
    deadline: '',
    reward: '',
  });

  const styles = createStyles(theme);

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.targetValue.trim()) {
      Alert.alert('Error', 'El título y valor objetivo son obligatorios');
      return;
    }

    const deadline = formData.deadline || getDefaultDeadline(formData.type);

    addGoal({
      ...formData,
      targetValue: parseInt(formData.targetValue),
      deadline,
    });

    setFormData({
      title: '',
      description: '',
      targetValue: '',
      type: 'daily',
      category: 'tasks',
      deadline: '',
      reward: '',
    });
    setShowAddForm(false);
  };

  const getDefaultDeadline = (type: string) => {
    const now = new Date();
    switch (type) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
    }
    return now.toISOString();
  };

  const getProgressValue = (goal: any) => {
    switch (goal.category) {
      case 'tasks':
        return tasks.filter(task => task.completed).length;
      case 'time':
        return tasks.reduce((total, task) => 
          task.completed ? total + (task.actualDuration || task.duration) : total, 0
        );
      case 'streak':
        // Calculate current streak
        return 5; // Placeholder
      default:
        return 0;
    }
  };

  const getProgressPercentage = (goal: any) => {
    const current = getProgressValue(goal);
    return Math.min((current / goal.targetValue) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tasks': return CheckCircle2;
      case 'time': return Clock;
      case 'streak': return Trophy;
      default: return Target;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'tasks': return 'Tareas';
      case 'time': return 'Tiempo';
      case 'streak': return 'Racha';
      default: return 'General';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'Diaria';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensual';
      default: return 'General';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Target size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Metas</Text>
        </View>
        <Text style={styles.headerSubtitle}>Establece y alcanza tus objetivos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={20} color={theme.colors.primary} />
          <Text style={styles.addButtonText}>Crear Nueva Meta</Text>
        </TouchableOpacity>

        {showAddForm && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Nueva Meta</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Título</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
                placeholder="Ej: Completar 5 tareas diarias"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descripción</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                placeholder="Describe tu meta..."
                multiline
                numberOfLines={3}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Valor Objetivo</Text>
                <TextInput
                  style={styles.input}
                  value={formData.targetValue}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, targetValue: text }))}
                  placeholder="5"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Tipo</Text>
                <View style={styles.segmentedControl}>
                  {['daily', 'weekly', 'monthly'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.segmentButton,
                        formData.type === type && styles.segmentButtonActive
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, type: type as any }))}
                    >
                      <Text style={[
                        styles.segmentButtonText,
                        formData.type === type && styles.segmentButtonTextActive
                      ]}>
                        {getTypeLabel(type)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.categoryOptions}>
                {['tasks', 'time', 'streak'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category && styles.categoryOptionActive
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, category: category as any }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      formData.category === category && styles.categoryOptionTextActive
                    ]}>
                      {getCategoryLabel(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Recompensa</Text>
              <TextInput
                style={styles.input}
                value={formData.reward}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reward: text }))}
                placeholder="Ej: Ver una película"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Crear Meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const IconComponent = getCategoryIcon(goal.category);
            const progress = getProgressPercentage(goal);
            const currentValue = getProgressValue(goal);
            
            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <View style={[styles.goalIcon, { backgroundColor: theme.colors.primary }]}>
                      <IconComponent size={20} color="#ffffff" />
                    </View>
                    <View style={styles.goalDetails}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalType}>
                        {getCategoryLabel(goal.category)} • {getTypeLabel(goal.type)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteGoal(goal.id)}
                  >
                    <Trash2 size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>

                {goal.description && (
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                )}

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${progress}%`,
                          backgroundColor: goal.completed ? theme.colors.success : theme.colors.primary
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {currentValue} / {goal.targetValue}
                  </Text>
                </View>

                {goal.reward && (
                  <View style={styles.rewardContainer}>
                    <Trophy size={16} color={theme.colors.warning} />
                    <Text style={styles.rewardText}>{goal.reward}</Text>
                  </View>
                )}

                {goal.completed && (
                  <View style={styles.completedBadge}>
                    <CheckCircle2 size={16} color={theme.colors.success} />
                    <Text style={styles.completedText}>¡Completada!</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary,
  },
  form: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  segmentButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: '#ffffff',
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  categoryOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  categoryOptionTextActive: {
    color: '#ffffff',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  goalType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.warning,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.success,
  },
  deleteButton: {
    padding: 8,
  },
});
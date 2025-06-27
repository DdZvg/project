import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudyContext } from '@/contexts/StudyContext';
import { PrioritySelector } from '@/components/PrioritySelector';
import { DateTimeSelector } from '@/components/DateTimeSelector';
import { RepeatSelector } from '@/components/RepeatSelector';
import { StudyTask, Priority, RepeatType } from '@/types/StudyTask';
import { Plus, Save } from 'lucide-react-native';

export default function AddTaskScreen() {
  const { addTask } = useStudyContext();
  const [formData, setFormData] = useState({
    subject: '',
    reminderDate: new Date(),
    duration: '',
    priority: 'medium' as Priority,
    notes: '',
    repeatType: 'none' as RepeatType,
  });

  const handleSubmit = () => {
    if (!formData.subject.trim()) {
      Alert.alert('Error', 'El nombre de la asignatura es obligatorio');
      return;
    }

    if (!formData.duration.trim()) {
      Alert.alert('Error', 'La duración estimada es obligatoria');
      return;
    }

    const newTask: Omit<StudyTask, 'id' | 'completed' | 'createdAt'> = {
      subject: formData.subject.trim(),
      reminderDate: formData.reminderDate.toISOString(),
      duration: parseInt(formData.duration),
      priority: formData.priority,
      notes: formData.notes.trim(),
      repeatType: formData.repeatType,
    };

    addTask(newTask);
    
    // Reset form
    setFormData({
      subject: '',
      reminderDate: new Date(),
      duration: '',
      priority: 'medium',
      notes: '',
      repeatType: 'none',
    });

    Alert.alert('Éxito', 'Tarea creada correctamente');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Plus size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>Nueva Tarea</Text>
        </View>
        <Text style={styles.headerSubtitle}>Crea una nueva sesión de estudio</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Asignatura / Tema *</Text>
          <TextInput
            style={styles.input}
            value={formData.subject}
            onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
            placeholder="Ej: Matemáticas - Álgebra"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <DateTimeSelector
          date={formData.reminderDate}
          onDateChange={(date) => setFormData(prev => ({ ...prev, reminderDate: date }))}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Duración estimada (minutos) *</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) => setFormData(prev => ({ ...prev, duration: text }))}
            placeholder="60"
            keyboardType="numeric"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <PrioritySelector
          priority={formData.priority}
          onPriorityChange={(priority) => setFormData(prev => ({ ...prev, priority }))}
        />

        <RepeatSelector
          repeatType={formData.repeatType}
          onRepeatChange={(repeatType) => setFormData(prev => ({ ...prev, repeatType }))}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notas adicionales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
            placeholder="Capítulos a estudiar, ejercicios específicos, etc."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Save size={20} color="#ffffff" />
          <Text style={styles.submitButtonText}>Crear Tarea</Text>
        </TouchableOpacity>
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
  form: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1f2937',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
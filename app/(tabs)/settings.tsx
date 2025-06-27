import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStudyContext } from '@/contexts/StudyContext';
import { Settings as SettingsIcon, Bell, Trash2, Download, Upload } from 'lucide-react-native';

export default function SettingsScreen() {
  const { notificationsEnabled, toggleNotifications } = useNotificationContext();
  const { clearAllTasks, exportData, importData } = useStudyContext();

  const handleClearAllTasks = () => {
    Alert.alert(
      'Eliminar todas las tareas',
      '¿Estás seguro de que quieres eliminar todas las tareas? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: clearAllTasks
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      await exportData();
      Alert.alert('Éxito', 'Datos exportados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron exportar los datos');
    }
  };

  const handleImportData = async () => {
    try {
      await importData();
      Alert.alert('Éxito', 'Datos importados correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudieron importar los datos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SettingsIcon size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>
        <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#6366f1" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Recordatorios</Text>
                <Text style={styles.settingDescription}>
                  Recibe notificaciones para tus sesiones de estudio
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#d1d5db', true: '#a5b4fc' }}
              thumbColor={notificationsEnabled ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
            <View style={styles.settingInfo}>
              <Download size={20} color="#059669" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Exportar datos</Text>
                <Text style={styles.settingDescription}>
                  Crea una copia de seguridad de tus tareas
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleImportData}>
            <View style={styles.settingInfo}>
              <Upload size={20} color="#2563eb" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Importar datos</Text>
                <Text style={styles.settingDescription}>
                  Restaura tus tareas desde una copia de seguridad
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={handleClearAllTasks}>
            <View style={styles.settingInfo}>
              <Trash2 size={20} color="#dc2626" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: '#dc2626' }]}>
                  Eliminar todas las tareas
                </Text>
                <Text style={styles.settingDescription}>
                  Borra permanentemente todas las tareas
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.appName}>StudyReminder</Text>
            <Text style={styles.appVersion}>Versión 1.0.0</Text>
            <Text style={styles.appDescription}>
              Una aplicación diseñada para ayudarte a organizar y mantener un seguimiento
              efectivo de tus sesiones de estudio. Mejora tu productividad académica con
              recordatorios inteligentes y un calendario integrado.
            </Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingRow: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#6366f1',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 20,
  },
});
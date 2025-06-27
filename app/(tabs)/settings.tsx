import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationContext } from '@/contexts/NotificationContext';
import { useStudyContext } from '@/contexts/StudyContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Bell, Trash2, Download, Upload, Moon, Sun, Palette, Volume2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { notificationsEnabled, toggleNotifications } = useNotificationContext();
  const { clearAllTasks, exportData, importData, userLevel, totalPoints } = useStudyContext();

  const styles = createStyles(theme);

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
          <SettingsIcon size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>
        <Text style={styles.headerSubtitle}>Personaliza tu experiencia</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu Progreso</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>Nivel {userLevel}</Text>
              <Text style={styles.statLabel}>Nivel actual</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Puntos totales</Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              {isDark ? (
                <Moon size={20} color={theme.colors.primary} />
              ) : (
                <Sun size={20} color={theme.colors.primary} />
              )}
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Modo Oscuro</Text>
                <Text style={styles.settingDescription}>
                  Cambia entre tema claro y oscuro
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '50' }}
              thumbColor={isDark ? theme.colors.primary : theme.colors.surface}
            />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Palette size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Colores Personalizados</Text>
                <Text style={styles.settingDescription}>
                  Personaliza los colores de la aplicación
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={theme.colors.primary} />
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
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '50' }}
              thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.surface}
            />
          </View>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Volume2 size={20} color={theme.colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sonidos</Text>
                <Text style={styles.settingDescription}>
                  Personaliza los sonidos de notificación
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={handleExportData}>
            <View style={styles.settingInfo}>
              <Download size={20} color={theme.colors.success} />
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
              <Upload size={20} color={theme.colors.info} />
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
              <Trash2 size={20} color={theme.colors.error} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.error }]}>
                  Eliminar todas las tareas
                </Text>
                <Text style={styles.settingDescription}>
                  Borra permanentemente todas las tareas
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.appName}>StudyReminder Pro</Text>
            <Text style={styles.appVersion}>Versión 2.0.0</Text>
            <Text style={styles.appDescription}>
              Una aplicación completa diseñada para ayudarte a organizar y mantener un seguimiento
              efectivo de tus sesiones de estudio. Incluye sistema de gamificación, metas personalizables,
              técnica Pomodoro, categorías de materias y análisis detallado de tu progreso.
            </Text>
            
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>Características principales:</Text>
              <Text style={styles.featureItem}>• Sistema de puntos y niveles</Text>
              <Text style={styles.featureItem}>• Metas personalizables</Text>
              <Text style={styles.featureItem}>• Timer Pomodoro integrado</Text>
              <Text style={styles.featureItem}>• Categorías de materias</Text>
              <Text style={styles.featureItem}>• Estadísticas detalladas</Text>
              <Text style={styles.featureItem}>• Modo oscuro/claro</Text>
              <Text style={styles.featureItem}>• Notificaciones inteligentes</Text>
            </View>
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 2,
  },
});
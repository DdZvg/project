import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useStudyContext } from '@/contexts/StudyContext';
import { 
  Home, 
  Plus, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Moon,
  Sun,
  User,
  Trophy
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface DrawerLayoutProps {
  children: React.ReactNode;
}

export default function DrawerLayout({ children }: DrawerLayoutProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { userLevel, totalPoints } = useStudyContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState('home');

  const styles = createStyles(theme);

  const menuItems = [
    { id: 'home', title: 'Inicio', icon: Home },
    { id: 'add-task', title: 'Agregar Tarea', icon: Plus },
    { id: 'categories', title: 'Categorías', icon: BookOpen },
    { id: 'statistics', title: 'Estadísticas', icon: BarChart3 },
    { id: 'settings', title: 'Configuración', icon: Settings },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const selectScreen = (screenId: string) => {
    setActiveScreen(screenId);
    setIsDrawerOpen(false);
  };

  const renderDrawer = () => (
    <View style={[styles.drawer, { left: isDrawerOpen ? 0 : -width * 0.8 }]}>
      <SafeAreaView style={styles.drawerContent}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.appTitle}>StudyReminder Pro</Text>
          
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <User size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.userStats}>
              <Text style={styles.userLevel}>Nivel {userLevel}</Text>
              <Text style={styles.userPoints}>{totalPoints} puntos</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() => selectScreen(item.id)}
              >
                <IconComponent 
                  size={20} 
                  color={isActive ? theme.colors.primary : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.menuItemText,
                  isActive && styles.activeMenuItemText
                ]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            {isDark ? (
              <Sun size={20} color={theme.colors.textSecondary} />
            ) : (
              <Moon size={20} color={theme.colors.textSecondary} />
            )}
            <Text style={styles.themeToggleText}>
              {isDark ? 'Modo Claro' : 'Modo Oscuro'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );

  const renderOverlay = () => (
    isDrawerOpen && (
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={toggleDrawer}
        activeOpacity={1}
      />
    )
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Menu size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {menuItems.find(item => item.id === activeScreen)?.title || 'StudyReminder Pro'}
        </Text>
        <View style={styles.headerRight}>
          <Trophy size={20} color={theme.colors.primary} />
          <Text style={styles.headerPoints}>{totalPoints}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {children}
      </View>

      {renderOverlay()}
      {renderDrawer()}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingTop: 50,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerPoints: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: theme.colors.surface,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: theme.colors.primary,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userStats: {
    flex: 1,
  },
  userLevel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
  },
  userPoints: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  activeMenuItem: {
    backgroundColor: theme.colors.primary + '15',
    borderRightWidth: 3,
    borderRightColor: theme.colors.primary,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
  activeMenuItemText: {
    color: theme.colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  themeToggleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: theme.colors.textSecondary,
  },
});
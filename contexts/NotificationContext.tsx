import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StudyTask } from '@/types/StudyTask';

interface NotificationContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  scheduleNotification: (task: StudyTask) => Promise<void>;
  cancelNotification: (taskId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_KEY = '@notifications_enabled';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadNotificationSettings();
    requestPermissions();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (enabled !== null) {
        setNotificationsEnabled(JSON.parse(enabled));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
    }
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const scheduleNotification = async (task: StudyTask) => {
    if (!notificationsEnabled || Platform.OS === 'web') {
      return;
    }

    try {
      const reminderDate = new Date(task.reminderDate);
      const now = new Date();
      
      if (reminderDate <= now) {
        return; // Don't schedule notifications for past dates
      }

      const secondsUntilReminder = Math.floor((reminderDate.getTime() - now.getTime()) / 1000);

      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
          title: '📚 Hora de estudiar!',
          body: `Es momento de estudiar: ${task.subject}`,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: {
          seconds: secondsUntilReminder,
        },
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (taskId: string) => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(taskId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
        scheduleNotification,
        cancelNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
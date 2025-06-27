import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react-native';

export default function PomodoroScreen() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          handleTimerComplete();
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    if (!isBreak) {
      // Pomodoro completed
      setCompletedPomodoros(prev => prev + 1);
      Alert.alert(
        '🍅 ¡Pomodoro Completado!',
        'Excelente trabajo. Es hora de tomar un descanso.',
        [
          {
            text: 'Descanso Corto (5min)',
            onPress: () => startBreak(5),
          },
          {
            text: 'Descanso Largo (15min)',
            onPress: () => startBreak(15),
          },
        ]
      );
    } else {
      // Break completed
      Alert.alert(
        '⏰ Descanso Terminado',
        '¡Es hora de volver al trabajo!',
        [
          {
            text: 'Comenzar Pomodoro',
            onPress: () => startPomodoro(),
          },
        ]
      );
    }
  };

  const startBreak = (duration: number) => {
    setIsBreak(true);
    setMinutes(duration);
    setSeconds(0);
    setIsActive(true);
  };

  const startPomodoro = () => {
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setMinutes(5);
    } else {
      setMinutes(25);
    }
    setSeconds(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Timer size={28} color="#6366f1" />
          <Text style={styles.headerTitle}>Pomodoro</Text>
        </View>
        <Text style={styles.headerSubtitle}>Técnica de productividad</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <View style={[styles.timerCircle, isBreak && styles.breakCircle]}>
            <View style={styles.progressRing}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    transform: [{ rotate: `${(progress * 3.6)}deg` }],
                    backgroundColor: isBreak ? '#10b981' : '#6366f1'
                  }
                ]} 
              />
            </View>
            <View style={styles.timerContent}>
              <Text style={[styles.timerText, isBreak && styles.breakText]}>
                {formatTime(minutes, seconds)}
              </Text>
              <Text style={styles.timerLabel}>
                {isBreak ? 'Descanso' : 'Enfoque'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetTimer}
          >
            <RotateCcw size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.playButton, isBreak && styles.breakButton]}
            onPress={toggleTimer}
          >
            {isActive ? (
              <Pause size={32} color="#ffffff" />
            ) : (
              <Play size={32} color="#ffffff" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={() => startBreak(5)}
          >
            <Coffee size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedPomodoros}</Text>
            <Text style={styles.statLabel}>Pomodoros Completados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedPomodoros * 25}</Text>
            <Text style={styles.statLabel}>Minutos de Enfoque</Text>
          </View>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>¿Cómo funciona?</Text>
          <Text style={styles.instructionsText}>
            1. Trabaja enfocado durante 25 minutos{'\n'}
            2. Toma un descanso de 5 minutos{'\n'}
            3. Repite el ciclo{'\n'}
            4. Cada 4 pomodoros, toma un descanso largo (15-30 min)
          </Text>
        </View>
      </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  breakCircle: {
    shadowColor: '#10b981',
  },
  progressRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 8,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: '#6366f1',
    transformOrigin: 'right center',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  breakText: {
    color: '#10b981',
  },
  timerLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  breakButton: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
  },
  resetButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  stats: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
});
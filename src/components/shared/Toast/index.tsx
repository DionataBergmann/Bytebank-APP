import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../utils/colors';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onHide: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
  action,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Mostrar toast
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto esconder após duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.greenEntry,
          icon: 'checkmark-circle',
          iconColor: colors.white,
        };
      case 'error':
        return {
          backgroundColor: colors.redExit,
          icon: 'close-circle',
          iconColor: colors.white,
        };
      case 'warning':
        return {
          backgroundColor: '#FFA500',
          icon: 'warning',
          iconColor: colors.white,
        };
      case 'info':
        return {
          backgroundColor: colors.primary,
          icon: 'information-circle',
          iconColor: colors.white,
        };
      default:
        return {
          backgroundColor: colors.greenEntry,
          icon: 'checkmark-circle',
          iconColor: colors.white,
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: config.backgroundColor }]}>
        <View style={styles.content}>
          <Ionicons
            name={config.icon as any}
            size={24}
            color={config.iconColor}
          />
          <Text style={styles.message}>{message}</Text>
        </View>

        {action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={action.onPress}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Toast;




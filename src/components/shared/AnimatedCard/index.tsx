import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../utils/colors';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  duration = 500,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, duration, delay]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AnimatedCard;







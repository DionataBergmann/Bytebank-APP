import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { colors } from '../../utils/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../../components/shared';

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC = () => {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de entrada do logo com rotação e escala
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação do texto com fade e slide
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso contínua para o logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Animação da barra de progresso
    const progressAnimation = Animated.loop(
      Animated.timing(progressWidth, {
        toValue: width - 100,
        duration: 2500,
        useNativeDriver: false,
      })
    );
    progressAnimation.start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo com efeitos visuais */}
          <Animated.View style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [
                { scale: Animated.multiply(logoScale, pulseScale) },
                {
                  rotate: logoRotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }
              ],
            }
          ]}>
            <View style={styles.logoWrapper}>
              <Logo size={100} type="real" />
            </View>
          </Animated.View>

          {/* Título */}
          <Animated.Text style={[
            styles.title,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}>
            ByteBank
          </Animated.Text>

          {/* Subtítulo */}
          <Animated.Text style={[
            styles.subtitle,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}>
            Suas finanças em um só lugar
          </Animated.Text>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            <Animated.View style={[
              styles.progressBar,
              { width: progressWidth }
            ]} />
          </View>

          {/* Texto de carregamento */}
          <Animated.Text style={[
            styles.loadingText,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}>
            Carregando...
          </Animated.Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 60,
    textAlign: 'center',
    fontWeight: '300',
    lineHeight: 24,
  },
  progressContainer: {
    width: width - 100,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 3,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.8,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});

export default LoadingScreen;





import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';
import { colors } from '../../../utils/colors';

interface LogoVariantProps {
  size?: number;
  variant?: 'primary' | 'white' | 'dark' | 'minimal' | 'gradient';
  style?: ViewStyle;
}

// Logo minimalista com apenas a letra B estilizada
export const MinimalLogo: React.FC<LogoVariantProps> = ({
  size = 80,
  variant = 'primary',
  style
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          background: 'transparent',
          foreground: colors.white,
        };
      case 'dark':
        return {
          background: 'transparent',
          foreground: colors.textPrimary,
        };
      case 'gradient':
        return {
          background: 'transparent',
          foreground: colors.primary,
        };
      default:
        return {
          background: 'transparent',
          foreground: colors.primary,
        };
    }
  };

  const logoColors = getColors();
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Letra B minimalista */}
        <Path
          d={`M ${radius * 0.25} ${radius * 0.2} 
               L ${radius * 0.25} ${radius * 1.8}
               M ${radius * 0.25} ${radius * 0.2}
               L ${radius * 0.75} ${radius * 0.2}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.9} ${radius * 0.35}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.9} ${radius * 0.65}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.75} ${radius * 0.8}
               L ${radius * 0.25} ${radius * 0.8}
               M ${radius * 0.25} ${radius * 1.0}
               L ${radius * 0.75} ${radius * 1.0}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.9} ${radius * 1.15}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.9} ${radius * 1.45}
               A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.75} ${radius * 1.6}
               L ${radius * 0.25} ${radius * 1.6}`}
          stroke={logoColors.foreground}
          strokeWidth={radius * 0.08}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

// Logo com design de banco/moeda
export const BankLogo: React.FC<LogoVariantProps> = ({
  size = 80,
  variant = 'primary',
  style
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          background: colors.white,
          foreground: colors.primary,
          accent: colors.primaryDark,
        };
      case 'dark':
        return {
          background: colors.textPrimary,
          foreground: colors.white,
          accent: colors.lightGray,
        };
      default:
        return {
          background: colors.white,
          foreground: colors.primary,
          accent: colors.primaryDark,
        };
    }
  };

  const logoColors = getColors();
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculo de fundo */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill={logoColors.background}
          stroke={logoColors.foreground}
          strokeWidth="2"
        />

        {/* Símbolo de moeda/banco */}
        <G transform={`translate(${radius}, ${radius})`}>
          {/* Círculo central */}
          <Circle
            cx="0"
            cy="0"
            r={radius * 0.3}
            fill={logoColors.foreground}
          />

          {/* Letra B estilizada */}
          <Path
            d={`M ${-radius * 0.15} ${-radius * 0.2} 
                 L ${-radius * 0.15} ${radius * 0.2}
                 M ${-radius * 0.15} ${-radius * 0.2}
                 L ${radius * 0.15} ${-radius * 0.2}
                 A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.23} ${-radius * 0.12}
                 A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.23} ${radius * 0.12}
                 A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.15} ${radius * 0.2}
                 L ${-radius * 0.15} ${radius * 0.2}`}
            stroke={logoColors.background}
            strokeWidth={radius * 0.06}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Elementos decorativos - linhas de crescimento */}
          <Path
            d={`M ${-radius * 0.4} ${-radius * 0.1} 
                 L ${-radius * 0.2} ${-radius * 0.1}
                 M ${-radius * 0.4} ${0} 
                 L ${-radius * 0.2} ${0}
                 M ${-radius * 0.4} ${radius * 0.1} 
                 L ${-radius * 0.2} ${radius * 0.1}`}
            stroke={logoColors.accent}
            strokeWidth={radius * 0.03}
            strokeLinecap="round"
          />

          <Path
            d={`M ${radius * 0.2} ${-radius * 0.1} 
                 L ${radius * 0.4} ${-radius * 0.1}
                 M ${radius * 0.2} ${0} 
                 L ${radius * 0.4} ${0}
                 M ${radius * 0.2} ${radius * 0.1} 
                 L ${radius * 0.4} ${radius * 0.1}`}
            stroke={logoColors.accent}
            strokeWidth={radius * 0.03}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
};

// Logo com design de escudo (segurança financeira)
export const ShieldLogo: React.FC<LogoVariantProps> = ({
  size = 80,
  variant = 'primary',
  style
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          background: colors.white,
          foreground: colors.primary,
          accent: colors.primaryDark,
        };
      case 'dark':
        return {
          background: colors.textPrimary,
          foreground: colors.white,
          accent: colors.lightGray,
        };
      default:
        return {
          background: colors.white,
          foreground: colors.primary,
          accent: colors.primaryDark,
        };
    }
  };

  const logoColors = getColors();
  const radius = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculo de fundo */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 2}
          fill={logoColors.background}
          stroke={logoColors.foreground}
          strokeWidth="2"
        />

        {/* Escudo com letra B */}
        <Path
          d={`M ${radius * 0.3} ${radius * 0.4} 
               L ${radius * 0.5} ${radius * 0.25}
               L ${radius * 0.7} ${radius * 0.4}
               L ${radius * 0.7} ${radius * 0.6}
               A ${radius * 0.2} ${radius * 0.2} 0 0 1 ${radius * 0.5} ${radius * 0.8}
               A ${radius * 0.2} ${radius * 0.2} 0 0 1 ${radius * 0.3} ${radius * 0.6}
               Z`}
          fill={logoColors.foreground}
        />

        {/* Letra B dentro do escudo */}
        <Path
          d={`M ${radius * 0.4} ${radius * 0.45} 
               L ${radius * 0.4} ${radius * 0.55}
               M ${radius * 0.4} ${radius * 0.45}
               L ${radius * 0.6} ${radius * 0.45}
               A ${radius * 0.05} ${radius * 0.05} 0 0 1 ${radius * 0.65} ${radius * 0.5}
               A ${radius * 0.05} ${radius * 0.05} 0 0 1 ${radius * 0.65} ${radius * 0.55}
               A ${radius * 0.05} ${radius * 0.05} 0 0 1 ${radius * 0.6} ${radius * 0.6}
               L ${radius * 0.4} ${radius * 0.6}`}
          stroke={logoColors.background}
          strokeWidth={radius * 0.04}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});



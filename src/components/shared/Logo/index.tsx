import React from 'react';
import { View, StyleSheet, ViewStyle, Image, ImageSourcePropType } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../../../utils/colors';

interface LogoProps {
  size?: number;
  variant?: 'primary' | 'white' | 'dark';
  type?: 'default' | 'minimal' | 'bank' | 'shield' | 'real';
  style?: ViewStyle;
  source?: ImageSourcePropType;
}

const Logo: React.FC<LogoProps> = ({
  size = 80,
  variant = 'primary',
  type = 'default',
  style,
  source
}) => {
  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          background: colors.white,
          foreground: colors.primary,
          text: colors.primary,
        };
      case 'dark':
        return {
          background: colors.textPrimary,
          foreground: colors.white,
          text: colors.white,
        };
      default:
        return {
          background: colors.white,
          foreground: colors.primary,
          text: colors.primary,
        };
    }
  };

  const logoColors = getColors();
  const radius = size / 2;

  const renderDefaultLogo = () => (
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

      {/* Design da letra B estilizada */}
      <Path
        d={`M ${radius * 0.3} ${radius * 0.25} 
             L ${radius * 0.3} ${radius * 1.75}
             A ${radius * 0.2} ${radius * 0.2} 0 0 1 ${radius * 0.5} ${radius * 1.55}
             L ${radius * 0.7} ${radius * 1.55}
             A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.85} ${radius * 1.4}
             A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.85} ${radius * 1.1}
             A ${radius * 0.15} ${radius * 0.15} 0 0 1 ${radius * 0.7} ${radius * 0.95}
             L ${radius * 0.5} ${radius * 0.95}
             A ${radius * 0.2} ${radius * 0.2} 0 0 1 ${radius * 0.3} ${radius * 0.75}
             L ${radius * 0.3} ${radius * 0.25}
             Z
             M ${radius * 0.4} ${radius * 0.4}
             L ${radius * 0.6} ${radius * 0.4}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.7} ${radius * 0.5}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.7} ${radius * 0.7}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.6} ${radius * 0.8}
             L ${radius * 0.4} ${radius * 0.8}
             Z
             M ${radius * 0.4} ${radius * 1.1}
             L ${radius * 0.6} ${radius * 1.1}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.7} ${radius * 1.2}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.7} ${radius * 1.4}
             A ${radius * 0.1} ${radius * 0.1} 0 0 1 ${radius * 0.6} ${radius * 1.5}
             L ${radius * 0.4} ${radius * 1.5}
             Z`}
        fill={logoColors.foreground}
      />

      {/* Elementos decorativos - pequenos círculos */}
      <Circle
        cx={radius * 0.2}
        cy={radius * 0.3}
        r={radius * 0.05}
        fill={logoColors.foreground}
        opacity={0.6}
      />
      <Circle
        cx={radius * 0.8}
        cy={radius * 0.7}
        r={radius * 0.04}
        fill={logoColors.foreground}
        opacity={0.4}
      />
      <Circle
        cx={radius * 0.15}
        cy={radius * 1.6}
        r={radius * 0.03}
        fill={logoColors.foreground}
        opacity={0.5}
      />
    </Svg>
  );

  const renderMinimalLogo = () => (
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
  );

  const renderBankLogo = () => (
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
      <Circle
        cx={radius}
        cy={radius}
        r={radius * 0.3}
        fill={logoColors.foreground}
      />

      {/* Letra B estilizada */}
      <Path
        d={`M ${radius * 0.7} ${radius * 0.6} 
             L ${radius * 0.7} ${radius * 1.4}
             M ${radius * 0.7} ${radius * 0.6}
             L ${radius * 0.85} ${radius * 0.6}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.93} ${radius * 0.68}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.93} ${radius * 0.82}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.85} ${radius * 0.9}
             L ${radius * 0.7} ${radius * 0.9}
             M ${radius * 0.7} ${radius * 1.0}
             L ${radius * 0.85} ${radius * 1.0}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.93} ${radius * 1.08}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.93} ${radius * 1.22}
             A ${radius * 0.08} ${radius * 0.08} 0 0 1 ${radius * 0.85} ${radius * 1.3}
             L ${radius * 0.7} ${radius * 1.3}`}
        stroke={logoColors.background}
        strokeWidth={radius * 0.06}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const renderShieldLogo = () => (
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
  );

  const renderRealLogo = () => {
    const logoSource = source || require('../../../assets/logo.png');

    return (
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}>
        <Image
          source={logoSource}
          style={{
            width: size * 0.6,
            height: size * 0.6,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  };

  const renderLogo = () => {
    switch (type) {
      case 'minimal':
        return renderMinimalLogo();
      case 'bank':
        return renderBankLogo();
      case 'shield':
        return renderShieldLogo();
      case 'real':
        return renderRealLogo();
      default:
        return renderDefaultLogo();
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {renderLogo()}
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

export default Logo;

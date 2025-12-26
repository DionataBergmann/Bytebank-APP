import React, { ComponentType, Suspense } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from './colors';

/**
 * Componente de loading para lazy loading
 */
const LazyLoadingFallback: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

/**
 * HOC para lazy loading de componentes
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  Fallback: ComponentType = LazyLoadingFallback
) {
  const LazyComponent: React.FC<P> = (props) => (
    <Suspense fallback={<Fallback />}>
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyComponent;
}

/**
 * Lazy load de screens usando require dinâmico
 */
export function createLazyScreen(importFn: () => Promise<{ default: ComponentType<any> }>) {
  return React.lazy(importFn);
}




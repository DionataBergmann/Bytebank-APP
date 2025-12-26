import React, { lazy, Suspense } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const Stack = createNativeStackNavigator();

// Loading fallback component
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

// Lazy loading de screens
const LoginScreen = lazy(() => import('../screens/LoginScreen'));
const RegisterScreen = lazy(() => import('../screens/RegisterScreen'));

// Wrapper para Suspense
const withSuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={withSuspense(LoginScreen)} />
      <Stack.Screen name="Register" component={withSuspense(RegisterScreen)} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default AuthNavigator;





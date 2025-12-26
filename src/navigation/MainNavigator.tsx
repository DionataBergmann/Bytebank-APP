import React, { lazy, Suspense } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

const Tab = createBottomTabNavigator();

// Loading fallback component
const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

// Lazy loading de screens
const DashboardScreen = lazy(() => import('../screens/DashboardScreen'));
const TransactionsScreen = lazy(() => import('../screens/TransactionsScreen'));
const AddTransactionScreen = lazy(() => import('../screens/AddTransactionScreen'));
const ProfileScreen = lazy(() => import('../screens/ProfileScreen'));

// Wrapper para Suspense
const withSuspense = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transações') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Adicionar') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
        lazy: true, // Lazy load das tabs
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={withSuspense(DashboardScreen)}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Transações"
        component={withSuspense(TransactionsScreen)}
        options={{ title: 'Transações' }}
      />
      <Tab.Screen
        name="Adicionar"
        component={withSuspense(AddTransactionScreen)}
        options={{ title: 'Adicionar' }}
      />
      <Tab.Screen
        name="Perfil"
        component={withSuspense(ProfileScreen)}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
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

export default MainNavigator;















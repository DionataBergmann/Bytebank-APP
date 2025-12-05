import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { firebaseInitService } from './src/services/firebaseInitService';
import { testFirebaseConnection } from './src/utils/firebaseTest';
import { useAuthState } from './src/hooks';
import { CacheManager } from './src/infrastructure/cache/CacheManager';
import './src/config/firebase'; // Inicializar Firebase

// Componente interno que usa o hook de autenticação
const AppContent: React.FC = () => {
  useAuthState();

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  useEffect(() => {
    // Inicializar Firebase quando o app carregar
    const initializeApp = async () => {
      // Inicializar cache (limpa itens expirados)
      await CacheManager.initialize();

      await firebaseInitService.initialize();

      // Testar conexão com Firebase (apenas em desenvolvimento)
      if (__DEV__) {
        const result = await testFirebaseConnection();
        console.log('🔥 Firebase Test Result:', result);
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

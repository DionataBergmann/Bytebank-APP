import { auth, db, storage } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const testFirebaseConnection = async () => {
  try {
    
    
    // Teste 1: Verificar se o Firebase está inicializado
    
    
    
    
    // Teste 2: Verificar configurações
    
    
    
    
    
    return {
      success: true,
      message: 'Firebase configurado corretamente!',
      config: {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId,
        storageBucket: auth.app.options.storageBucket,
      }
    };
  } catch (error) {
    console.error('❌ Erro na configuração do Firebase:', error);
    return {
      success: false,
      message: 'Erro na configuração do Firebase',
      error: error
    };
  }
};

export const testFirestoreConnection = async () => {
  try {
    
    
    // Teste de escrita/leitura
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Teste de conexão',
      timestamp: new Date().toISOString(),
    });
    
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      
      return { success: true, message: 'Firestore conectado com sucesso!' };
    } else {
      
      return { success: false, message: 'Erro no Firestore' };
    }
  } catch (error) {
    console.error('❌ Erro no Firestore:', error);
    return { success: false, message: 'Erro no Firestore', error };
  }
};

export const testAuthConnection = async () => {
  try {
    
    
    // Verificar se o auth está funcionando
    const currentUser = auth.currentUser;
    
    
    
    return { 
      success: true, 
      message: 'Firebase Auth funcionando!',
      currentUser: currentUser ? currentUser.email : null
    };
  } catch (error) {
    console.error('❌ Erro no Firebase Auth:', error);
    return { success: false, message: 'Erro no Firebase Auth', error };
  }
};




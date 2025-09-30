import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { User as AppUser, LoginCredentials, RegisterData } from '../../types/auth';

export const firebaseAuthService = {
  // Login com email e senha
  async login(credentials: LoginCredentials): Promise<{ user: AppUser; token: string }> {
    try {
      
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      
      
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      // Buscar dados adicionais do usuário no Firestore
      
      let userData = {};
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        userData = userDoc.exists() ? userDoc.data() : {};
        
      } catch (firestoreError) {
        console.warn('⚠️ Erro ao buscar dados do Firestore:', firestoreError);
        
      }
      
      const appUser: AppUser = {
        id: user.uid,
        name: user.displayName || (userData as any)?.name || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
        avatar: user.photoURL || (userData as any)?.avatar || '',
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      
      
      
      return { user: appUser, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Registro de novo usuário
  async register(data: RegisterData): Promise<{ user: AppUser; token: string }> {
    try {
      
      
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      
      
      const user = userCredential.user;
      
      // Salvar dados adicionais no Firestore PRIMEIRO
      const userData = {
        name: data.name,
        email: data.email,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      
      
      
      
      try {
        await setDoc(doc(db, 'users', user.uid), userData);
        
      } catch (firestoreError) {
        console.error('❌ Erro ao salvar no Firestore:', firestoreError);
        // Não vamos falhar o registro se o Firestore falhar
        console.warn('⚠️ Continuando registro mesmo com erro no Firestore');
      }
      
      // Atualizar perfil do usuário (opcional)
      try {
        await updateProfile(user, {
          displayName: data.name,
        });
        
      } catch (profileError) {
        console.warn('⚠️ Erro ao atualizar perfil:', profileError);
        // Não vamos falhar o registro se o updateProfile falhar
      }
      
      const token = await user.getIdToken();
      
      
      const appUser: AppUser = {
        id: user.uid,
        name: data.name,
        email: data.email,
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { user: appUser, token };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Erro ao fazer logout');
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<AppUser | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      return {
        id: user.uid,
        name: user.displayName || userData.name || '',
        email: user.email || '',
        avatar: user.photoURL || (userData as any)?.avatar || '',
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Erro ao buscar dados do usuário');
    }
  },

  // Observar mudanças no estado de autenticação
  onAuthStateChanged(callback: (user: AppUser | null) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const appUser = await this.getCurrentUser();
          callback(appUser);
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Recuperar senha
  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Alterar senha
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Reautenticar usuário
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Atualizar senha
      await updatePassword(user, newPassword);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Atualizar perfil
  async updateProfile(data: Partial<AppUser>): Promise<AppUser> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Atualizar perfil no Firebase Auth
      if (data.name) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }

      // Atualizar dados no Firestore
      const userData = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      
      return await this.getCurrentUser() as AppUser;
    } catch (error: any) {
      throw new Error('Erro ao atualizar perfil');
    }
  },

  // Obter token de acesso
  async getToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken();
    } catch (error) {
      return null;
    }
  },

  // Mapear códigos de erro do Firebase para mensagens em português
  getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuário desabilitado',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/invalid-credential': 'Credenciais inválidas',
    };

    return errorMessages[errorCode] || 'Erro de autenticação';
  },
};




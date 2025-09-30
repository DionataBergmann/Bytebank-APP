import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { colors } from '../../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout() as any);
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleSettingPress = (setting: string) => {
    Alert.alert('Configuração', `${setting} será implementado em breve!`);
  };

  const profileOptions = [
    {
      icon: 'person-outline',
      title: 'Editar Perfil',
      subtitle: 'Alterar informações pessoais',
      onPress: () => handleSettingPress('Editar Perfil'),
    },
    {
      icon: 'lock-closed-outline',
      title: 'Alterar Senha',
      subtitle: 'Modificar senha de acesso',
      onPress: () => handleSettingPress('Alterar Senha'),
    },
    {
      icon: 'notifications-outline',
      title: 'Notificações',
      subtitle: 'Configurar alertas e lembretes',
      onPress: () => handleSettingPress('Notificações'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Segurança',
      subtitle: 'Configurações de segurança',
      onPress: () => handleSettingPress('Segurança'),
    },
    {
      icon: 'color-palette-outline',
      title: 'Aparência',
      subtitle: 'Tema e personalização',
      onPress: () => handleSettingPress('Aparência'),
    },
    {
      icon: 'language-outline',
      title: 'Idioma',
      subtitle: 'Português (Brasil)',
      onPress: () => handleSettingPress('Idioma'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Ajuda e Suporte',
      subtitle: 'Central de ajuda e contato',
      onPress: () => handleSettingPress('Ajuda e Suporte'),
    },
    {
      icon: 'information-circle-outline',
      title: 'Sobre o App',
      subtitle: 'Versão 1.0.0',
      onPress: () => handleSettingPress('Sobre o App'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header com informações do usuário */}
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.headerGradient}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Text style={styles.avatarText}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={colors.white} />
                </View>
              )}
            </View>
            <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'usuario@email.com'}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Configurações rápidas */}
      <View style={styles.quickSettings}>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text style={styles.settingTitle}>Notificações</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="finger-print" size={24} color={colors.primary} />
            <Text style={styles.settingTitle}>Login Biométrico</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Lista de opções */}
      <View style={styles.optionsContainer}>
        {profileOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionItem}
            onPress={option.onPress}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textDisabled} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>

      {/* Modal de confirmação de logout */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out" size={48} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Sair da Conta</Text>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja sair? Você precisará fazer login novamente para acessar o app.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
  },
  quickSettings: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  optionsContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 30,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  confirmButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.error,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
});

export default ProfileScreen;




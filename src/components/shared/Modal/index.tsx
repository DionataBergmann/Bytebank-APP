import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ModalProps,
} from 'react-native';
import { colors } from '../../../utils/colors';
import { Ionicons } from '@expo/vector-icons';

interface CustomModalProps extends Omit<ModalProps, 'children'> {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<CustomModalProps> = ({
  title,
  children,
  onClose,
  showCloseButton = true,
  containerStyle,
  headerStyle,
  contentStyle,
  ...props
}) => {
  return (
    <RNModal
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      {...props}
    >
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.header, headerStyle]}>
          <Text style={styles.title}>{title}</Text>
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundGray,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});







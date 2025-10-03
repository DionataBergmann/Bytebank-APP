import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../../utils/colors';
import { Button } from '../shared';

interface FileUploaderProps {
  selectedFile: any;
  onFileSelect: (file: any) => void;
  error?: string;
  acceptTypes?: string[];
  maxSize?: number; // em MB
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  onFileSelect,
  error,
  acceptTypes = ['image/*', 'application/pdf'],
  maxSize = 10, // 10MB por padrão
}) => {
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: acceptTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        if (!file.name) {
          throw new Error('Nome do arquivo não encontrado');
        }

        if (!file.size || file.size === 0) {
          throw new Error('Arquivo vazio ou corrompido');
        }

        // Verificar tamanho do arquivo
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
        }

        // Verificar tipo MIME se disponível
        if (file.mimeType) {
          const isAllowedType = acceptTypes.some(type => {
            if (type.endsWith('/*')) {
              return file.mimeType?.startsWith(type.slice(0, -1));
            }
            return file.mimeType === type;
          });

          if (!isAllowedType) {
            throw new Error(`Tipo de arquivo não suportado. Tipos permitidos: ${acceptTypes.join(', ')}`);
          }
        }

        // Verificar extensão do arquivo como fallback
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

        if (fileExtension && !allowedExtensions.includes(fileExtension)) {
          throw new Error(`Extensão não suportada. Use: ${allowedExtensions.join(', ')}`);
        }

        onFileSelect(file);
      }
    } catch (error: any) {
      console.error('❌ Erro ao selecionar arquivo:', error);
      // Aqui você pode adicionar um toast ou alert para mostrar o erro
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Comprovante</Text>

      <Button
        title="Anexar comprovante"
        onPress={handleSelectFile}
        variant="outline"
        size="medium"
        icon={<Ionicons name="attach" size={20} color={colors.primaryBlue} />}
        style={styles.uploadButton}
      />

      {selectedFile && (
        <View style={styles.fileInfo}>
          <View style={styles.fileDetails}>
            <Ionicons name="document" size={16} color={colors.textSecondary} />
            <Text style={styles.fileName} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <Text style={styles.fileSize}>
              {selectedFile.size ? `${(selectedFile.size / 1024 / 1024).toFixed(1)}MB` : ''}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveFile}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  uploadButton: {
    alignSelf: 'flex-start',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.lightGray + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  fileName: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  removeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
});

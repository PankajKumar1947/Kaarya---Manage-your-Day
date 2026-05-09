import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Modal, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../app-text';
import { AppInput } from '../app-input';
import { AppButton } from '../app-button';
import { Colors } from '../../theme/colors';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string) => Promise<void>;
}

export const AddTodoModal: React.FC<AddTodoModalProps> = ({ 
  visible, 
  onClose, 
  onAdd 
}) => {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    
    setIsAdding(true);
    await onAdd(title);
    setTitle('');
    setIsAdding(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText variant="h2">Add New Task</AppText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <AppInput
            label="What needs to be done?"
            placeholder="E.g. Buy groceries"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <AppButton
            title="Create Task"
            onPress={handleAdd}
            loading={isAdding}
            disabled={!title.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  }
});

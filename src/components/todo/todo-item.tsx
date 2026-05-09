import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../app-text';
import { Colors } from '../../theme/colors';
import { Todo } from '../../types';

interface TodoItemProps {
  item: Todo;
  onToggle: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ item, onToggle, onDelete }) => {
  const isCompleted = item.completed === 1;

  return (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
        {isCompleted && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
      <AppText style={[styles.todoTitle, isCompleted && styles.completedText]}>
        {item.title}
      </AppText>
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  todoTitle: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  deleteBtn: {
    padding: 4,
  }
});

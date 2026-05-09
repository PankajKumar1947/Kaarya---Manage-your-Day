import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { AppText } from '../app-text';

interface DateItemProps {
  dayNum: string;
  dayName: string;
  isSelected: boolean;
  onPress: () => void;
}

export const DateItem: React.FC<DateItemProps> = ({
  dayNum,
  dayName,
  isSelected,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.dayCircle,
        isSelected ? styles.activeDay : styles.inactiveDay
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <AppText
        bold
        style={styles.dayNumText}
        color={isSelected ? Colors.white : Colors.textPrimary}
      >
        {dayNum}
      </AppText>
      <AppText
        variant="caption"
        style={styles.dayNameText}
        color={isSelected ? 'rgba(255,255,255,0.8)' : Colors.textSecondary}
      >
        {dayName}
      </AppText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 8,
  },
  activeDay: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveDay: {
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
  },
  dayNameText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  dayNumText: {
    fontSize: 14,
  },
});

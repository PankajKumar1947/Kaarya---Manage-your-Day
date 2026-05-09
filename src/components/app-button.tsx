import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View,
  StyleProp
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  showArrow?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  loading = false, 
  disabled = false,
  showArrow = true
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        disabled && styles.disabled, 
        style
      ]} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {showArrow && (
            <Ionicons 
              name="arrow-forward-outline" 
              size={20} 
              color={Colors.white} 
              style={styles.arrow} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  arrow: {
    marginLeft: 10,
  },
  disabled: {
    backgroundColor: Colors.grey,
    shadowOpacity: 0,
    elevation: 0,
  },
});

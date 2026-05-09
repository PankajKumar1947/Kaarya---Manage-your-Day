import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Colors } from '../theme/colors';
import { AppText } from './app-text';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <AppText variant="label" style={styles.labelText}>{label}</AppText>}
      <View style={[
        styles.inputWrapper,
        error ? styles.inputError : (isFocused ? styles.inputFocused : styles.inputNormal)
      ]}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? Colors.primary : Colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={isFocused ? Colors.primary : Colors.textSecondary}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} />
          <AppText style={styles.errorText} color={Colors.error}>{error}</AppText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelText: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputNormal: {
    borderColor: Colors.inputBorder,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF5F5',
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
});

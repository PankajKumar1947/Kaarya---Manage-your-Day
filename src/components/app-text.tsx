import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { Colors } from '../theme/colors';

interface AppTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: 'h1' | 'h2' | 'body' | 'caption' | 'label';
  color?: string;
  bold?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({ 
  children, 
  style, 
  variant = 'body', 
  color = Colors.textPrimary,
  bold = false
}) => {
  return (
    <Text style={[
      styles.text, 
      styles[variant], 
      { color }, 
      bold && styles.bold,
      style
    ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
});

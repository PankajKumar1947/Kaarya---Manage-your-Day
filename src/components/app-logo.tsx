import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface AppLogoProps {
  size?: number;
  containerStyle?: ViewStyle;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 50, containerStyle }) => {
  return (
    <View style={[styles.logoContainer, containerStyle]}>
      <Ionicons name="apps" size={size} color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
});

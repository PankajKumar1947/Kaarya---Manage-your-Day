import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewStyle, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollable?: boolean;
  withKeyboardAvoidingView?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ 
  children, 
  style, 
  contentContainerStyle,
  scrollable = false,
  withKeyboardAvoidingView = true
}) => {
  const ContentWrapper = scrollable ? ScrollView : View;

  const content = (
    <ContentWrapper 
      contentContainerStyle={[
        scrollable ? styles.scrollContent : undefined,
        contentContainerStyle
      ]} 
      style={styles.container}
      showsVerticalScrollIndicator={scrollable}
    >
      {children}
    </ContentWrapper>
  );

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {withKeyboardAvoidingView ? (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {content}
        </KeyboardAvoidingView>
      ) : content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

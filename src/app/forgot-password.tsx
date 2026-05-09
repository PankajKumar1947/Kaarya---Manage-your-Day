import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/screen-container';
import { AppText } from '../components/app-text';
import { AppButton } from '../components/app-button';
import { Colors } from '../theme/colors';

type ResetMethod = 'email' | '2fa' | 'google';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod>('2fa');

  const methods = [
    {
      id: 'email' as ResetMethod,
      title: 'Email Address',
      description: 'Send via email address securely.',
      icon: 'mail' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: '2fa' as ResetMethod,
      title: '2 Factor Authentication',
      description: 'Send via 2FA securely.',
      icon: 'phone-portrait' as keyof typeof Ionicons.glyphMap,
    },
    {
      id: 'google' as ResetMethod,
      title: 'Google Authenticator',
      description: 'Send via authenticator securely.',
      icon: 'lock-closed' as keyof typeof Ionicons.glyphMap,
    },
  ];

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <AppText variant="h1" style={styles.title}>Forgot Password</AppText>
            <AppText variant="caption">Select which methods you'd like to reset.</AppText>
          </View>
        </View>

        <View style={styles.methodsContainer}>
          {methods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.selectedCard
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={method.icon} size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.methodInfo}>
                <AppText bold style={styles.methodTitle}>{method.title}</AppText>
                <AppText variant="caption">{method.description}</AppText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton 
          title="Reset Password" 
          onPress={() => {}} 
          style={styles.button}
        />
        <View style={styles.lockIconContainer}>
             <Ionicons name="lock-closed" size={150} color={Colors.black} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  methodsContainer: {
    marginTop: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: '#F9FFF0',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 17,
    marginBottom: 2,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  button: {
    marginBottom: 20,
    zIndex: 1,
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: -40,
    zIndex: -1,
    opacity: 0.05,
  }
});

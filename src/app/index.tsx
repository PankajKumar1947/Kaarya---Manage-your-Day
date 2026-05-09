import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/screen-container';
import { AppText } from '../components/app-text';
import { AppButton } from '../components/app-button';
import { AppLogo } from '../components/app-logo';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/auth-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user]);

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
            <AppLogo size={80} />
            <AppText variant="h1" style={styles.logoText}>Kaarya</AppText>
        </View>
        
        <AppText variant="h2" style={styles.tagline}>
          Your daily productivity companion.
        </AppText>
        <AppText variant="caption" style={styles.description}>
          Organize your tasks, achieve your goals, and simplify your life with Kaarya.
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton 
          title="Get Started" 
          onPress={() => router.push('/register')} 
          style={styles.button}
        />
        <AppButton 
          title="Sign In" 
          onPress={() => router.push('/login')} 
          style={styles.secondaryButton}
          textStyle={styles.secondaryButtonText}
          showArrow={false}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 16,
  },
  tagline: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  actions: {
    width: '100%',
  },
  button: {
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    color: Colors.primary,
  },
});

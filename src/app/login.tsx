import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/screen-container';
import { AppText } from '../components/app-text';
import { AppInput } from '../components/app-input';
import { AppButton } from '../components/app-button';
import { AppLogo } from '../components/app-logo';
import { Colors } from '../theme/colors';
import { useAuth } from '../context/auth-context';

export default function LoginScreen() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user]);

  const handleLogin = async () => {
    if (email && password) {
      await login(email, password);
    }
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <AppLogo />
        <AppText variant="h1" style={styles.title}>Sign In</AppText>
        <AppText variant="caption">Let's experience the joy of Kaarya.</AppText>
      </View>

      <View style={styles.form}>
        <AppInput 
          label="Email Address" 
          placeholder="Enter your email..." 
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon="mail-outline"
        />
        <AppInput 
          label="Password" 
          placeholder="Enter your password..." 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon="lock-closed-outline"
          rightIcon="eye-off-outline"
        />
        
        <AppButton 
          title="Sign In" 
          onPress={handleLogin} 
          style={styles.button}
          loading={isLoading}
        />

        <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <AppText variant="caption">
          Don't have an account?{' '}
          <Link href="/register" style={styles.link}>
            Sign Up.
          </Link>
        </AppText>
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <AppText style={styles.forgotText}>Forgot your password?</AppText>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  form: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 32,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  link: {
    color: Colors.primary,
    fontWeight: '700',
  },
  forgotText: {
    color: Colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  }
});
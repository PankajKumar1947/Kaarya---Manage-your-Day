import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton } from '../components/app-button';
import { AppInput } from '../components/app-input';
import { AppLogo } from '../components/app-logo';
import { AppText } from '../components/app-text';
import { ScreenContainer } from '../components/screen-container';
import { useAuth } from '../context/auth-context';
import { Colors } from '../theme/colors';

export default function RegisterScreen() {
  const { user, register, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user) {
      router.replace('/home');
    }
  }, [user]);

  const handleSignUp = async () => {
    if (!name) {
      setError('ERROR: Name is required!');
    } else if (password !== confirmPassword) {
      setError('ERROR: Password do not match!');
    } else if (email && password) {
      setError('');
      await register(name, email, password);
    }
  };

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <AppLogo />
        <AppText variant="h1" style={styles.title}>Sign Up For Free</AppText>
        <AppText variant="caption">Sign up in 1 minute for free!</AppText>
      </View>

      <View style={styles.form}>
        <AppInput
          label="Full Name"
          placeholder="Enter your name..."
          value={name}
          onChangeText={setName}
          leftIcon="person-outline"
        />
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
          placeholder="*******************"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon="lock-closed-outline"
          rightIcon="eye-outline"
          error={error}
        />
        <AppInput
          label="Password Confirmation"
          placeholder="*******************"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          leftIcon="lock-closed-outline"
          rightIcon="eye-outline"
        />

        <AppButton
          title="Sign Up"
          onPress={handleSignUp}
          style={styles.button}
          loading={isLoading}
        />
      </View>

      <View style={styles.footer}>
        <AppText variant="caption">
          Already have an account?{' '}
          <Link href="/login" style={styles.link}>
            Sign In.
          </Link>
        </AppText>
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
    marginTop: 40,
    marginBottom: 32,
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
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  link: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
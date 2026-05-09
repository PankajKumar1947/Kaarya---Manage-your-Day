import { initDatabase } from "@/db/schema";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "../context/auth-context";
import { TodoProvider } from "../context/todo-context";

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      setReady(true);
    };

    setup();
  }, []);

  if (!ready) return null;
  return (
    <AuthProvider>
      <TodoProvider>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="register" options={{ title: 'Register' }} />
          <Stack.Screen name="forgot-password" options={{ title: 'Forgot Password' }} />
          <Stack.Screen name="home" options={{ title: 'Home' }} />
        </Stack>
      </TodoProvider>
    </AuthProvider>
  );
}

import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { HomeScreen, LoginScreen, SignUpScreen } from './src/screens';

type AuthScreen = 'login' | 'signup';

function AppContent() {
  const { user, loading } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  // Loading while checking existing session
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#D4A843" />
      </View>
    );
  }

  // Not authenticated → show login/signup
  if (!user) {
    if (authScreen === 'signup') {
      return <SignUpScreen onNavigateToLogin={() => setAuthScreen('login')} />;
    }
    return <LoginScreen onNavigateToSignUp={() => setAuthScreen('signup')} />;
  }

  // Authenticated → show app
  return <HomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0F',
  },
});

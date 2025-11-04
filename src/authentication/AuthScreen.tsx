import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SignUpScreen from './SignUpScreen';
import SignInScreen from './SignInScreen';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

type AuthMode = 'signup' | 'signin';

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                smart<Text style={styles.logoTextAccent}>biz</Text>
              </Text>
            </View>
            <Text style={styles.byAmazon}>by amazon</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Radio Button Options */}
            <View style={styles.radioContainer}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAuthMode('signup')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {authMode === 'signup' && <View style={styles.radioButtonSelected} />}
                </View>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioText}>Create new Amazon account</Text>
                  <Text style={styles.radioSubtext}>New to Amazon?</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => setAuthMode('signin')}
                activeOpacity={0.7}
              >
                <View style={styles.radioButton}>
                  {authMode === 'signin' && <View style={styles.radioButtonSelected} />}
                </View>
                <Text style={styles.radioText}>Sign in with your Amazon account</Text>
              </TouchableOpacity>
            </View>

            {/* Render Sign Up or Sign In */}
            {authMode === 'signup' ? (
              <SignUpScreen 
                onAuthenticated={onAuthenticated}
                onSwitchToSignIn={() => setAuthMode('signin')}
              />
            ) : (
              <SignInScreen 
                onAuthenticated={onAuthenticated}
                onSwitchToSignUp={() => setAuthMode('signup')}
              />
            )}
          </View>

          {/* Footer Copyright */}
          <Text style={styles.copyright}>
            © 1996-2025, Amazon.com, Inc. or its affiliates
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  logoTextAccent: {
    color: '#22b0a7',
    fontStyle: 'italic',
    fontWeight: '300',
  },
  byAmazon: {
    fontSize: 12,
    color: '#035f6b',
    fontWeight: '400',
  },
  welcomeContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007185',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007185',
  },
  radioTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '400',
  },
  radioSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
    marginLeft: 32,
  },
  copyright: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});

export default AuthScreen;


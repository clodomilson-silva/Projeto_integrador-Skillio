

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from './providers/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('https://seuservidor.com/auth/login/', {
        username: email,
        password,
      });
      const { access, refresh } = response.data;
      login(access, refresh);
      alert('Login realizado! Bem-vindo de volta ao Skillio!');
      router.replace('/Dashboard');
    } catch (error: any) {
      let description = 'Ocorreu um erro inesperado. Tente novamente.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 401) {
          description = 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (axiosError.response?.status === 400 && axiosError.response?.data?.detail) {
          description = axiosError.response.data.detail;
        }
      }
      alert(description);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={styles.iconCircle}><Text style={{ fontSize: 32, color: '#fff' }}>📖</Text></View>
            <Text style={styles.title}>Entrar no Skillio</Text>
            <Text style={styles.subtitle}>Acesse sua conta e continue aprendendo</Text>
          </View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading} style={styles.eyeButton}>
              <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Register')}><Text style={styles.link}>Não tem uma conta? Criar conta</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.link}>← Voltar para o início</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    backgroundColor: '#e75327',
    borderRadius: 999,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#e75327',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e75327',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  input: {
    backgroundColor: '#f4f4f4',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeButton: {
    padding: 10,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#e75327',
    padding: 14,
    borderRadius: 10,
    marginTop: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
});

export default Login;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearTextGradient } from "react-native-text-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";

// 👉 Importe seu AuthContext real quando disponível
// import { useAuth } from "@/contexts/AuthContext";
const useAuth = () => ({ login: () => {} }); // placeholder

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<any>();
  const route = useRoute();
  const { login } = useAuth();

  // Redirecionamento padrão
  const redirectTo = route?.params?.redirect || "Dashboard";

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://seuservidor.com/auth/login/",
        {
          username: email,
          password,
        }
      );

      const { access, refresh } = response.data;
      login(access, refresh);

      alert("Login realizado com sucesso!");
      navigation.replace(redirectTo);

    } catch (error: any) {
      let message = "Ocorreu um erro inesperado. Tente novamente.";

      if (error.response) {
        if (error.response.status === 401) {
          message = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.response.data?.detail) {
          message = error.response.data.detail;
        }
      }

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "hsl(222, 47%, 5%)",
        justifyContent: "center",
        padding: 20,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Logo / Cabeçalho */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <View
          style={{
            padding: 12,
            backgroundColor: "#ff7b2c",
            borderRadius: 100,
            shadowColor: "#ff7b2c",
            shadowOpacity: 0.4,
            shadowRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 32, color: "#fff" }}>📖</Text>
        </View>

        <LinearTextGradient
          locations={[0, 0.5, 1]}
          colors={["hsl(217, 91%, 65%)", "hsl(186, 100%, 58%)", "hsl(14, 100%, 58%)"]}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", paddingVertical: 2 }}>
            Entrar no Skillio
          </Text>
        </LinearTextGradient>

        <Text style={{ textAlign: "center", marginTop: 8, color: "#82A3A8" }}>
          Acesse sua conta e continue aprendendo
        </Text>
      </View>

      {/* Card */}
      <View
        style={{
          backgroundColor: "hsl(222, 47%, 5%)",
          borderRadius: 16,
          padding: 24,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
        }}
      >
        {/* Email */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Email</Text>
        <TextInput
          style={{
            backgroundColor: "#f4f4f4",
            borderWidth: 1,
            borderColor: "#bbb",
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
          }}
          placeholder="seu@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        {/* Senha */}
        <Text style={{ fontWeight: "600", marginBottom: 6 }}>Senha</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
          <TextInput
            style={{
              backgroundColor: "#f4f4f4",
              borderWidth: 1,
              borderColor: "#bbb",
              borderRadius: 8,
              padding: 10,
              flex: 1,
            }}
            placeholder="Sua senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            style={{ padding: 10, marginLeft: 6 }}
          >
            <Text style={{ fontSize: 18 }}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Botão */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          style={{
              backgroundColor: "hsl(14, 100%, 58%)",
              padding: 14,
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
        >
          {isLoading && (
            <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
          )}
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Links */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={{ color: "#007bff", textAlign: "center", marginTop: 15 }}>
          Esqueceu sua senha?
        </Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center", marginVertical: 12 }}>
        <View
          style={{ width: "80%", borderTopWidth: 1, borderColor: "#bbb" }}
        />
        <Text
          style={{
            position: "absolute",
            top: -10,
            paddingHorizontal: 8,
            color: "#888",
            fontSize: 12,
          }}
        >
          Ou
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
      >
        <Text
          style={{ color: "#ff7b2c", textAlign: "center", fontWeight: "600" }}
        >
          Não tem uma conta? Criar conta
        </Text>
      </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Index")}
        >
        <Text style={{ color: "#555", marginTop: 25, textAlign: "center" }}>
          ← Voltar para o início
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

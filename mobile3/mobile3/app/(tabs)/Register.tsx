
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, StyleSheet, ScrollView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
// import { useAuth } from "@/contexts/AuthContext";
const useAuth = () => ({ login: () => {} }); // Placeholder


const TermosCondicoes = () => (
  <Text style={{ fontSize: 13, color: '#888', marginBottom: 8, textAlign: 'center' }}>
    Ao criar uma conta, você concorda com nossos
    <Text style={{ color: '#e75327', textDecorationLine: 'underline' }}> Termos e Condições</Text>.
  </Text>
);


const escolaridadeOptions = [
  { label: "Selecione", value: "" },
  { label: "Básico", value: "basico" },
  { label: "Ensino Fundamental", value: "fundamental" },
  { label: "Ensino Médio", value: "medio" },
  { label: "Superior", value: "superior" },
];

const opcoesFoco = ["ENEM", "Lógica", "Direito", "Português", "Matemática", "Programação", "História"];

const Register = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [escolaridade, setEscolaridade] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [profissao, setProfissao] = useState("");
  const [foco, setFoco] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<any>(null);

  // Validação e navegação
  const handleAvancar = () => {
    if (step === 1) {
      if (!aceitouTermos || !name || !email || !password || !confirmPassword) {
        alert("Preencha todos os campos e aceite os termos.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Senhas não coincidem");
        return;
      }
      if (password.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres.");
        return;
      }
    }
    if (step === 2) {
      if (!escolaridade || !dataNascimento) {
        alert("Preencha sua escolaridade e data de nascimento.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleVoltar = () => setStep(step - 1);

  // Foto de perfil (apenas preview, upload real depende do backend)
  const handleFotoChange = async () => {
    // Use expo-image-picker para selecionar imagem
    // Exemplo: const result = await ImagePicker.launchImageLibraryAsync(...)
    // setFotoPreview(result.uri);
    // setFotoFile(result);
    alert("Seleção de foto não implementada. Use expo-image-picker.");
  };

  const handleCadastro = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('first_name', name);
    formData.append('terms_accepted', String(aceitouTermos));
    if (dataNascimento) formData.append('birth_date', dataNascimento);
    if (escolaridade) formData.append('educational_level', escolaridade);
    if (profissao) formData.append('profession', profissao);
    if (foco) formData.append('focus', foco);
    if (fotoFile) formData.append('foto', fotoFile);
    try {
      const response = await axios.post('https://seuservidor.com/users/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { access, refresh } = response.data;
      login(access, refresh);
      alert("Conta criada com sucesso! Bem-vindo ao Skillio!");
      navigation.replace("QuizNivelamento");
    } catch (error: any) {
      let description = "Ocorreu um erro inesperado. Tente novamente.";
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data) {
          try {
            const errors = axiosError.response.data;
            const errorKey = Object.keys(errors)[0];
            const errorMessages = errors[errorKey];
            const message = Array.isArray(errorMessages) ? errorMessages[0] : errorMessages;
            description = message.replace("user with this email already exists.", "Já existe uma conta com este e-mail.");
          } catch {
            description = "Não foi possível processar o erro retornado pelo servidor.";
          }
        }
      }
      alert(description);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={styles.iconCircle}><Text style={{ fontSize: 32, color: '#fff' }}>👤</Text></View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se ao Skillio e comece a aprender</Text>
        </View>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleVoltar} disabled={isLoading}>
            <Text style={{ fontSize: 18, color: '#e75327' }}>←</Text>
          </TouchableOpacity>
        )}
        {step === 1 && (
          <View>
            <Text style={styles.label}>Nome</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome completo" editable={!isLoading} />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu_email@email.com" keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput style={[styles.input, { flex: 1 }]} value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres" secureTextEntry={!showPassword} editable={!isLoading} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading} style={styles.eyeButton}>
                <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.passwordRow}>
              <TextInput style={[styles.input, { flex: 1 }]} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirme sua senha" secureTextEntry={!showConfirmPassword} editable={!isLoading} />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading} style={styles.eyeButton}>
                <Text style={{ fontSize: 18 }}>{showConfirmPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            <TermosCondicoes />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <TouchableOpacity onPress={() => setAceitouTermos(!aceitouTermos)} disabled={isLoading} style={styles.checkbox}>
                <Text style={{ fontSize: 18 }}>{aceitouTermos ? "☑" : "☐"}</Text>
              </TouchableOpacity>
              <Text style={{ marginLeft: 8 }}>Aceito os termos e condições</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAvancar} disabled={isLoading || !(aceitouTermos && name && email && password && confirmPassword)}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Avançar</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}> <Text style={styles.link}>Já possui conta? Login</Text></TouchableOpacity>
          </View>
        )}
        {step === 2 && (
          <View>
            <Text style={styles.label}>Escolaridade</Text>
            <View style={styles.pickerBox}>
              {escolaridadeOptions.map(opt => (
                <TouchableOpacity key={opt.value} style={[styles.pickerOption, escolaridade === opt.value && styles.pickerSelected]} onPress={() => setEscolaridade(opt.value)} disabled={isLoading}>
                  <Text style={{ color: escolaridade === opt.value ? '#e75327' : '#222' }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="AAAA-MM-DD" editable={!isLoading} />
            <Text style={styles.label}>Profissão (Opcional)</Text>
            <TextInput style={styles.input} value={profissao} onChangeText={setProfissao} placeholder="Sua profissão" editable={!isLoading} />
            <TouchableOpacity style={styles.button} onPress={handleAvancar} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Avançar</Text>}
            </TouchableOpacity>
          </View>
        )}
        {step === 3 && (
          <View>
            <Text style={styles.label}>Qual seu foco?</Text>
            <TextInput style={styles.input} value={foco} onChangeText={setFoco} placeholder="Digite seu foco principal (ex: ENEM, Lógica...)" editable={!isLoading} />
            <View style={styles.pickerBox}>
              {opcoesFoco.map((opt, i) => (
                <TouchableOpacity key={i} style={[styles.pickerOption, foco === opt && styles.pickerSelected]} onPress={() => setFoco(opt)} disabled={isLoading}>
                  <Text style={{ color: foco === opt ? '#e75327' : '#222' }}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAvancar} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Avançar</Text>}
            </TouchableOpacity>
          </View>
        )}
        {step === 4 && (
          <View>
            <Text style={styles.label}>Foto de perfil (Opcional)</Text>
            {fotoPreview && (
              <Image source={{ uri: fotoPreview }} style={styles.fotoPreview} />
            )}
            <TouchableOpacity style={styles.button} onPress={handleFotoChange} disabled={isLoading}>
              <Text style={styles.buttonText}>Selecionar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Finalizar Cadastro</Text>}
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Index")}><Text style={styles.link}>← Voltar para o início</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f4f4',
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
  checkbox: {
    padding: 4,
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
  backButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
  },
  pickerBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pickerOption: {
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#bbb',
  },
  pickerSelected: {
    borderColor: '#e75327',
    backgroundColor: '#ffe5db',
  },
  fotoPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default Register;

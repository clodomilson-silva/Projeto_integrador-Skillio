import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation<any>();

  // Placeholder data (replace with your hooks/data source)
  const userName = 'Usuário';
  const profilePicture = `https://api.dicebear.com/8.x/adventurer/svg?seed=${userName}`;
  const level = 1;
  const xp = 0;
  const streak = 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: profilePicture }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.welcome}>
              Bem-vindo, <Text style={styles.name}>{userName}</Text>!
            </Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}>Nível: <Text style={styles.statValue}>{level}</Text></Text>
              <Text style={styles.stat}>• XP: <Text style={styles.statValue}>{xp}</Text></Text>
              {streak > 0 && (
                <Text style={styles.stat}>• Sequência: <Text style={styles.statValue}>{streak}d</Text></Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.outline]}
            onPress={() => navigation.navigate('QuizNivelamento')}
          >
            <Text style={styles.buttonTextOutline}>Fazer Quiz de nivelamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primary]}
            onPress={() => navigation.navigate('Trilha')}
          >
            <Text style={styles.buttonText}>Próxima Lição</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Calendário de Atividades</Text>
          <Text style={styles.cardText}>
            Estatísticas e calendário ainda não implementados na versão móvel.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'hsl(222, 47%, 5%)' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ccc' },
  headerInfo: { flex: 1, marginLeft: 12 },
  welcome: { color: '#fff', fontSize: 18, fontWeight: '700' },
  name: { color: '#ff7b2c' },
  statsRow: { flexDirection: 'row', marginTop: 6 },
  stat: { color: '#82A3A8', marginRight: 10 },
  statValue: { color: '#fff', fontWeight: '700' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 6 },
  primary: { backgroundColor: 'hsl(14, 100%, 58%)' },
  outline: { borderWidth: 1, borderColor: '#fff', backgroundColor: 'transparent' },
  buttonText: { color: '#fff', fontWeight: '700' },
  buttonTextOutline: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#0f1720', padding: 16, borderRadius: 12 },
  cardTitle: { color: '#fff', fontWeight: '700', marginBottom: 8 },
  cardText: { color: '#82A3A8' },
});

export default Dashboard;

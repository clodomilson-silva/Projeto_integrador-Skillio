import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Trilha: undefined;
  QuizNivelamento: undefined;
  Register: undefined;
  Login: undefined;
};

const MenuFooter: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={styles.menuFooter}>
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Plataforma Educacional Gamificada</Text>
      </View>
      <Text style={styles.title}>
        Aprenda Brincando com o <Text style={styles.gradient}>Skillio</Text>
      </Text>
      <Text style={styles.description}>
        Transforme seus estudos em uma <Text style={styles.bold}>aventura emocionante</Text>. Jogue, aprenda e conquiste conhecimento em diversas disciplinas.
      </Text>
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Trilha')}>
          <Ionicons name="play" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Começar a Jogar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaOutline} onPress={() => navigation.navigate('QuizNivelamento')}>
          <Text style={styles.ctaOutlineText}>Quiz Rápido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaOutline} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.ctaOutlineText}>Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaOutline} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.ctaOutlineText}>Entrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>5+</Text>
          <Text style={styles.statLabel}>Disciplinas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>1000+</Text>
          <Text style={styles.statLabel}>Perguntas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>∞</Text>
          <Text style={styles.statLabel}>Diversão</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menuFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    zIndex: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.08)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  badgeText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 13,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  gradient: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    color: '#a3a3a3',
    textAlign: 'center',
    marginBottom: 16,
  },
  bold: {
    color: '#fff',
    fontWeight: 'bold',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ctaOutline: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  ctaOutlineText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 13,
    color: '#a3a3a3',
  },
});

export default MenuFooter;

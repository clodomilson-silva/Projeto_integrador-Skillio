import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import { User } from "lucide-react-native";
import { LinearTextGradient } from "react-native-text-gradient";

interface HeroStats {
  record: {
    holder: string | null;
    xp: number;
  };
  online_players: number;
}

export default function Hero() {

  const router = useRouter();
  const [stats, setStats] = useState<HeroStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(true); // Animação simplificada
  const handleStartPlaying = () => {
    alert("Começar a Jogar!");
  };

  useEffect(() => {
    // Simula chamada à API
    setTimeout(() => {
      setStats({
        record: { holder: "Renan", xp: 12000 },
        online_players: 42,
      });
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "hsl(222, 47%, 5%)" }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Badge */}
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
        <Text style={styles.badgeText}>Plataforma Educacional Gamificada</Text>
      </View>

      {/* Title */}
      {shouldAnimate ? (
        <Text style={styles.title}>Aprenda Brincando com o Skillio</Text>
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.title}>Aprenda Brincando com o</Text>
          <LinearTextGradient
            style={styles.gradient}
            locations={[0, 0.5, 1]}
            colors={["#3b82f6", "#22d3ee", "#e75327"]}
          >
            <Text style={[styles.gradient, { fontSize: 32 }]}> Skillio</Text>
          </LinearTextGradient>
        </View>
      )}

      {/* Description */}
      <Text style={styles.description}>
        Transforme seus estudos em uma{" "}
        <Text style={styles.bold}>aventura emocionante</Text>. Jogue, aprenda e
        conquiste conhecimento em diversas disciplinas.
      </Text>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        <TouchableOpacity style={styles.ctaButton} onPress={() => router.push('/Register')}> 
          <User size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.ctaButtonText}>Cadastrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaOutline}
          onPress={() => router.push('/Login')}
        >
          <Text style={styles.ctaOutlineText}>Entrar</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
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

      {/* Mascot and Stats Cards */}
      <View style={styles.mascotCard}>
        {/* Substitua o path da imagem pelo correto do seu projeto */}
        <Image
          source={require("@/assets/images/mascot.png")}
          style={styles.mascotImg}
        />
        <View style={styles.heroStatsCards}>
          <View style={styles.heroCard}>
            {loading ? (
              <ActivityIndicator size="small" color="#737373" />
            ) : stats?.record.holder ? (
              <View>
                <Text style={styles.heroCardLabel}>Recorde Atual</Text>
                <Text style={styles.heroCardValue}>
                  {stats.record.holder} • {stats.record.xp} XP
                </Text>
              </View>
            ) : (
              <Text style={styles.heroCardValue}>
                Seja o primeiro no ranking!
              </Text>
            )}
          </View>
          <View style={styles.heroCard}>
            {loading ? (
              <ActivityIndicator size="small" color="#737373" />
            ) : (
              <View>
                <Text style={styles.heroCardLabel}>Jogadores Online</Text>
                <Text style={styles.heroCardValue}>
                  {stats?.online_players || 0} ativos agora
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Seção inspirada no GamePreview do web */}
      <View style={styles.previewSection}>
        <Text style={styles.previewTitle}>
          Como <Text style={styles.previewGradient}>Funciona</Text>
        </Text>
        <Text style={styles.previewDesc}>
          Uma experiência de aprendizado completa com pontuação, tempo limite e
          feedback instantâneo!
        </Text>
        <View style={styles.previewFeaturesRow}>
          <View style={styles.previewFeatureBox}>
            <View
              style={[styles.previewIconCircle, { backgroundColor: "#3b82f6" }]}
            >
              <Text style={styles.previewIconText}>⏰</Text>
            </View>
            <Text style={styles.previewFeatureTitle}>Tempo Desafiador</Text>
            <Text style={styles.previewFeatureDesc}>
              Cada pergunta tem um tempo limite que testa sua agilidade mental e
              conhecimento instantâneo.
            </Text>
          </View>
          <View style={styles.previewFeatureBox}>
            <View
              style={[styles.previewIconCircle, { backgroundColor: "#f59e42" }]}
            >
              <Text style={styles.previewIconText}>🏆</Text>
            </View>
            <Text style={styles.previewFeatureTitle}>Sistema de Pontuação</Text>
            <Text style={styles.previewFeatureDesc}>
              Ganhe pontos por respostas corretas e rápidas. Bata seus recordes
              e compare com outros jogadores!
            </Text>
          </View>
          <View style={styles.previewFeatureBox}>
            <View
              style={[styles.previewIconCircle, { backgroundColor: "#fbbf24" }]}
            >
              <Text style={styles.previewIconText}>⚡</Text>
            </View>
            <Text style={styles.previewFeatureTitle}>Feedback Instantâneo</Text>
            <Text style={styles.previewFeatureDesc}>
              Receba feedback visual e sonoro imediato para cada resposta,
              aprendendo com seus erros e acertos.
            </Text>
          </View>
        </View>
        {/* Card de destaque para o Quiz Rápido - versão responsiva e simplificada */}
        <View style={styles.quizCard}>
          <Text style={styles.quizCardTitle}>
            Teste Seus Conhecimentos Agora!
          </Text>
          <Text style={styles.quizCardDesc}>
            100 perguntas rápidas de Matemática, Português, História, Geografia
            e Ciências. Sem necessidade de cadastro! Ganhe 10 XP por resposta
            certa.
          </Text>
          <View style={styles.quizCardBadgesRow}>
            <Text style={styles.quizCardBadge}>✓ Sem cadastro necessário</Text>
            <Text style={styles.quizCardBadge}>✓ 100 perguntas variadas</Text>
            <Text style={styles.quizCardBadge}>✓ Contador de XP</Text>
          </View>
          <TouchableOpacity
            style={styles.quizCardButton}
            onPress={() => alert("Jogar Agora!")}
          >
            <Text style={styles.quizCardButtonText}>⚡ Jogar Agora</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 60,
    backgroundColor: "hsl(222, 47%, 5%)",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "hsl(222, 47%, 5%)",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59,130,246,0.08)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
    marginRight: 8,
  },
  badgeText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 13,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  gradient: {
    fontWeight: "bold",
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  gradientText: {
    borderRadius: 4,
    paddingHorizontal: 2,
  },
  description: {
    fontSize: 18,
    color: "#a3a3a3",
    textAlign: "center",
    marginBottom: 16,
  },
  bold: {
    color: "#fff",
    fontWeight: "bold",
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e75327",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ctaOutline: {
    borderWidth: 2,
    borderColor: "#e75327",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  ctaOutlineText: {
    color: "#e75327",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  statBox: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 13,
    color: "#a3a3a3",
  },
  mascotCard: {
    borderRadius: 32,
    alignItems: "center",
    padding: 24,
    marginTop: 16,
  },
  mascotImg: {
    width: 180,
    height: 180,
    borderRadius: 0,
    marginBottom: 16,
  },
  heroStatsCards: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  heroCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    minWidth: 140,
  },
  heroCardLabel: {
    color: "#a3a3a3",
    fontSize: 13,
    marginBottom: 2,
    textAlign: "center",
  },
  heroCardValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  previewSection: {
    marginTop: 32,
    width: "100%",
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 4,
  },
  previewGradient: {
    color: "#e75327",
    fontWeight: "bold",
  },
  previewDesc: {
    fontSize: 16,
    color: "#a3a3a3",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 2,
  },
  previewFeaturesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  previewFeatureBox: {
    alignItems: "center",
    width: 110,
    padding: 8,
  },
  previewIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  previewIconText: {
    fontSize: 28,
    color: "#fff",
  },
  previewFeatureTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
    textAlign: "center",
  },
  previewFeatureDesc: {
    fontSize: 13,
    color: "#a3a3a3",
    textAlign: "center",
  },
  quizCard: {
    backgroundColor: "rgba(59,130,246,0.08)",
    borderRadius: 20,
    padding: 18,
    marginTop: 24,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    gap: 12,
  },
  quizCardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
    justifyContent: "center",
  },
  quizCardIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f59e42",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  quizCardIcon: {
    fontSize: 32,
    color: "#fff",
  },
  quizCardTextBox: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 8,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  quizCardDesc: {
    fontSize: 14,
    color: "#a3a3a3",
    marginBottom: 6,
  },
  quizCardBadgesRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 4,
  },
  quizCardBadge: {
    backgroundColor: "#262331",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    marginRight: 4,
    marginBottom: 2,
  },
  quizCardButton: {
    backgroundColor: "#e65327",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quizCardButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

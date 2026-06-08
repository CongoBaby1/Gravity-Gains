import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const foundation5 = [
  { id: 'wall-sit', name: 'Wall Sit', emoji: '🪑', duration: '3-5 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'plank', name: 'Dead-Stop Plank', emoji: '📏', duration: '2-4 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'superman', name: 'Superman Hold', emoji: '🦸', duration: '2-3 min', difficulty: 'Beginner', exercises: 1 },
  { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', emoji: '💪', duration: '2-4 min', difficulty: 'Intermediate', exercises: 1 },
  { id: 'horse-stance', name: 'Horse Stance', emoji: '🐴', duration: '3-5 min', difficulty: 'Intermediate', exercises: 1 },
];

const mobilityPrograms = [
  { id: 'morning', name: 'Morning Mobility', emoji: '🌅', duration: '10 min', difficulty: 'Beginner', exercises: 6 },
  { id: 'hip', name: 'Hip Mobility', emoji: '🦵', duration: '12 min', difficulty: 'Intermediate', exercises: 8 },
  { id: 'shoulder', name: 'Shoulder Mobility', emoji: '🙆', duration: '10 min', difficulty: 'Intermediate', exercises: 7 },
  { id: 'back', name: 'Back Mobility', emoji: '🧘', duration: '12 min', difficulty: 'Beginner', exercises: 6 },
  { id: 'recovery', name: 'Recovery Flow', emoji: '😌', duration: '15 min', difficulty: 'All Levels', exercises: 10 },
];

function ProgramCard({ program }: { program: typeof foundation5[0] }) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/exercise/${program.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{program.emoji}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardName}>{program.name}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>⏱ {program.duration}</Text>
              <Text style={styles.metaText}>📊 {program.difficulty}</Text>
              <Text style={styles.metaText}>📝 {program.exercises} exercise{program.exercises > 1 ? 's' : ''}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push(`/workout/${program.id}`)}
      >
        <LinearGradient
          colors={[Colors.orange, Colors.orangeLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.startBtn}
        >
          <Text style={styles.startBtnText}>▶️ Start Program</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

export default function ProgramsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🗂️ Programs</Text>
        <Text style={styles.subtitle}>Foundation 5 — master the basics</Text>
        {foundation5.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}

        <Text style={[styles.subtitle, { marginTop: Spacing.lg }]}>Mobility Programs</Text>
        {mobilityPrograms.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', marginBottom: Spacing.sm },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  emoji: { fontSize: FontSizes['3xl'], marginRight: Spacing.md },
  cardMeta: { flex: 1 },
  cardName: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.xs },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  metaText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  startBtn: {
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  startBtnText: { color: Colors.textPrimary, fontWeight: '700', fontSize: FontSizes.base },
});

import { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

const measurements = [
  { key: 'chest', label: 'Chest', emoji: '' },
  { key: 'waist', label: 'Waist', emoji: '' },
  { key: 'arms', label: 'Arms', emoji: '' },
  { key: 'legs', label: 'Legs', emoji: '' },
];

const prList = [
  { exercise: 'Wall Sit', time: '3:42', date: 'Jun 5' },
  { exercise: 'Plank', time: '2:15', date: 'Jun 3' },
  { exercise: 'Push-Up Hold', time: '1:28', date: 'May 28' },
  { exercise: 'Superman', time: '1:05', date: 'May 20' },
];

const scoreHistory = [
  { score: 420, date: 'Jun 1' },
  { score: 385, date: 'May 15' },
  { score: 340, date: 'May 1' },
  { score: 290, date: 'Apr 15' },
];

export default function TrackingScreen() {
  const { user } = useAuth();
  const [weight, setWeight] = useState(user?.weight ? String(user.weight) : '78.5');
  const [meas, setMeas] = useState<Record<string, string>>({
    chest: '102', waist: '84', arms: '36', legs: '58',
  });

  const streak = user?.workoutStreak ?? 12;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}> Progress Tracking</Text>

        {/* Weight Log */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> Weight Log</Text>
          <View style={styles.rowBetween}>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.unit}>kg</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}> Weight trend mini-chart placeholder</Text>
          </View>
        </View>

        {/* Measurements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> Measurements (cm)</Text>
          <View style={styles.measGrid}>
            {measurements.map((m) => (
              <View key={m.key} style={styles.measItem}>
                <Text style={styles.measEmoji}>{m.emoji}</Text>
                <Text style={styles.measLabel}>{m.label}</Text>
                <TextInput
                  style={styles.measInput}
                  value={meas[m.key]}
                  onChangeText={(v) => setMeas((p) => ({ ...p, [m.key]: v }))}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Gravity Score */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> Gravity Score History</Text>
          {scoreHistory.map((h, i) => (
            <View key={i} style={styles.timelineRow}>
              <Text style={styles.timelineDot}>●</Text>
              <Text style={styles.timelineDate}>{h.date}</Text>
              <View style={styles.timelineBarBg}>
                <View style={[styles.timelineBar, { width: `${(h.score / 1000) * 100}%` }]} />
              </View>
              <Text style={styles.timelineScore}>{h.score}</Text>
            </View>
          ))}
        </View>

        {/* Streak */}
        <View style={[styles.card, styles.streakCard]}>
          <Text style={styles.streakEmoji}></Text>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>day workout streak</Text>
        </View>

        {/* Photo Gallery */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> Photo Gallery</Text>
          <View style={styles.photoGrid}>
            <View style={styles.photoBox}><Text style={styles.photoText}>Before</Text></View>
            <View style={styles.photoBox}><Text style={styles.photoText}>After</Text></View>
          </View>
        </View>

        {/* PRs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}> Personal Records</Text>
          {prList.map((pr, i) => (
            <View key={i} style={styles.prRow}>
              <Text style={styles.prExercise}>{pr.exercise}</Text>
              <Text style={styles.prTime}> {pr.time}</Text>
              <Text style={styles.prDate}>{pr.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  title: { color: Colors.textPrimary, fontSize: FontSizes['3xl'], fontWeight: 'bold', marginBottom: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '700', marginBottom: Spacing.sm },
  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  input: {
    flex: 1,
    backgroundColor: Colors.darkElevated,
    color: Colors.textPrimary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.sm,
    fontSize: FontSizes.lg,
  },
  unit: { color: Colors.textSecondary, fontSize: FontSizes.lg },
  chartPlaceholder: {
    marginTop: Spacing.md,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  chartText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  measGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  measItem: {
    flex: 1,
    minWidth: 70,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  measEmoji: { fontSize: FontSizes.xl },
  measLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  measInput: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: Spacing.xs,
    minWidth: 50,
  },
  timelineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  timelineDot: { color: Colors.orange, fontSize: FontSizes.sm, marginRight: Spacing.sm },
  timelineDate: { color: Colors.textSecondary, fontSize: FontSizes.sm, width: 50 },
  timelineBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.darkElevated,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  timelineBar: { height: '100%', backgroundColor: Colors.gold, borderRadius: 4 },
  timelineScore: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '700', width: 40, textAlign: 'right' },
  streakCard: { alignItems: 'center', paddingVertical: Spacing.lg },
  streakEmoji: { fontSize: FontSizes.hero },
  streakNumber: { color: Colors.orange, fontSize: FontSizes['5xl'], fontWeight: 'bold', marginTop: Spacing.sm },
  streakLabel: { color: Colors.textSecondary, fontSize: FontSizes.lg, marginTop: Spacing.xs },
  photoGrid: { flexDirection: 'row', gap: Spacing.md },
  photoBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: { color: Colors.textMuted, fontSize: FontSizes.base },
  prRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.darkBorder },
  prExercise: { color: Colors.textPrimary, fontSize: FontSizes.base, flex: 1 },
  prTime: { color: Colors.gold, fontSize: FontSizes.base, fontWeight: '700', marginRight: Spacing.md },
  prDate: { color: Colors.textSecondary, fontSize: FontSizes.sm },
});

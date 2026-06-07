import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface Challenge {
  id: string;
  name: string;
  duration: string;
  participants: number;
  emoji: string;
  joined: boolean;
  progress: number;
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: '1', name: '7-Day Wall Sit', duration: '7 days', participants: 1240, emoji: '🧱', joined: false, progress: 0 },
  { id: '2', name: '30-Day Core', duration: '30 days', participants: 892, emoji: '🍑', joined: true, progress: 45 },
  { id: '3', name: 'Horse Stance Mastery', duration: '21 days', participants: 456, emoji: '🐴', joined: false, progress: 0 },
  { id: '4', name: '100-Day Consistency', duration: '100 days', participants: 203, emoji: '💯', joined: true, progress: 12 },
  { id: '5', name: '5-Min Plank', duration: '14 days', participants: 678, emoji: '🕐', joined: false, progress: 0 },
];

const leaderboard = [
  { rank: 1, name: 'Sarah Chen', score: 8750 },
  { rank: 2, name: 'Mike Ross', score: 7420 },
  { rank: 3, name: 'You', score: 4200 },
  { rank: 4, name: 'Alex Kim', score: 3890 },
  { rank: 5, name: 'Jordan Lee', score: 3540 },
];

export default function ChallengesScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  const joinChallenge = (id: string) => {
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, joined: true, progress: 0 } : c));
  };

  const myChallenges = challenges.filter((c) => c.joined);
  const availableChallenges = challenges.filter((c) => !c.joined);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏆 Challenges Hub</Text>
        </View>

        {myChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Challenges</Text>
            <View style={styles.grid}>
              {myChallenges.map((c) => (
                <View key={c.id} style={styles.myCard}>
                  <Text style={styles.cardEmoji}>{c.emoji}</Text>
                  <Text style={styles.cardName}>{c.name}</Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${c.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{c.progress}% complete</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Active Challenges</Text>
        <View style={styles.grid}>
          {availableChallenges.map((c) => (
            <View key={c.id} style={styles.card}>
              <Text style={styles.cardEmoji}>{c.emoji}</Text>
              <Text style={styles.cardName}>{c.name}</Text>
              <Text style={styles.cardMeta}>📅 {c.duration} · 👥 {c.participants}</Text>
              <TouchableOpacity style={styles.joinBtn} onPress={() => joinChallenge(c.id)}>
                <Text style={styles.joinText}>➕ Join Challenge</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>🏅 Leaderboard</Text>
        <View style={styles.leaderboard}>
          {leaderboard.map((entry) => (
            <View key={entry.rank} style={[styles.lbRow, entry.name === 'You' && styles.lbRowYou]}>
              <Text style={styles.lbRank}>{entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}</Text>
              <Text style={styles.lbName}>{entry.name}</Text>
              <Text style={styles.lbScore}>{entry.score.toLocaleString()}</Text>
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
  header: { marginBottom: Spacing.md },
  back: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.sm },
  title: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700' },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginTop: Spacing.lg, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  card: {
    width: '47%',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  myCard: {
    width: '47%',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.orange,
    padding: Spacing.md,
  },
  cardEmoji: { fontSize: 32, marginBottom: Spacing.sm },
  cardName: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '600' },
  cardMeta: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.xs },
  progressBg: {
    height: 6,
    backgroundColor: Colors.darkElevated,
    borderRadius: 3,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange,
    borderRadius: 3,
  },
  progressText: { color: Colors.textSecondary, fontSize: FontSizes.xs, marginTop: Spacing.xs },
  joinBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.orange,
    borderRadius: 10,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  joinText: { color: Colors.nearBlack, fontSize: FontSizes.sm, fontWeight: '600' },
  leaderboard: { gap: Spacing.sm },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  lbRowYou: { borderColor: Colors.orange },
  lbRank: { width: 40, color: Colors.orange, fontSize: FontSizes.base },
  lbName: { flex: 1, color: Colors.textPrimary, fontSize: FontSizes.base },
  lbScore: { color: Colors.textSecondary, fontSize: FontSizes.sm, fontWeight: '600' },
});

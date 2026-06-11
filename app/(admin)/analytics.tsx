import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const summaryCards = [
  { emoji: '', label: 'Daily Active Users', value: '1,847', change: '+12% vs last week', positive: true },
  { emoji: '', label: 'Workouts Completed', value: '3,241', change: '+8% vs last week', positive: true },
  { emoji: '', label: 'Avg Session Time', value: '28 min', change: '-3% vs last week', positive: false },
  { emoji: '', label: 'Challenges Joined', value: '567', change: '+22% vs last week', positive: true },
];

const weeklyData = [
  { day: 'Mon', workouts: 420, users: 1200 },
  { day: 'Tue', workouts: 510, users: 1350 },
  { day: 'Wed', workouts: 480, users: 1280 },
  { day: 'Thu', workouts: 620, users: 1520 },
  { day: 'Fri', workouts: 590, users: 1480 },
  { day: 'Sat', workouts: 710, users: 1700 },
  { day: 'Sun', workouts: 680, users: 1650 },
];

export default function AdminAnalyticsScreen() {
  const router = useRouter();
  const maxWorkouts = Math.max(...weeklyData.map((d) => d.workouts));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> Analytics</Text>
        </View>

        <Text style={styles.sectionTitle}>Key Metrics (Text Summary)</Text>
        <View style={styles.grid}>
          {summaryCards.map((card) => (
            <View key={card.label} style={styles.metricCard}>
              <Text style={styles.metricEmoji}>{card.emoji}</Text>
              <Text style={styles.metricValue}>{card.value}</Text>
              <Text style={styles.metricLabel}>{card.label}</Text>
              <Text style={[styles.metricChange, card.positive ? styles.positive : styles.negative]}>{card.change}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Weekly Workouts (Bar Chart Placeholder)</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {weeklyData.map((d) => {
              const heightPct = (d.workouts / maxWorkouts) * 100;
              return (
                <View key={d.day} style={styles.barCol}>
                  <View style={[styles.bar, { height: `${heightPct}%` }]} />
                  <Text style={styles.barLabel}>{d.day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <Text style={styles.legendText}> Workouts per day · Max: {maxWorkouts}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Top Exercises</Text>
        <View style={styles.list}>
          {[
            { name: 'Plank', count: 1240 },
            { name: 'Wall Sit', count: 980 },
            { name: 'Horse Stance', count: 650 },
            { name: 'Pull-Up', count: 420 },
          ].map((ex, i) => (
            <View key={i} style={styles.rankRow}>
              <Text style={styles.rankNum}>#{i + 1}</Text>
              <Text style={styles.rankName}>{ex.name}</Text>
              <Text style={styles.rankCount}>{ex.count} completions</Text>
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
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginTop: Spacing.lg, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  metricCard: {
    width: '47%',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  metricEmoji: { fontSize: 24, marginBottom: Spacing.sm },
  metricValue: { color: Colors.orange, fontSize: FontSizes.xl, fontWeight: '700' },
  metricLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  metricChange: { fontSize: FontSizes.xs, marginTop: Spacing.xs },
  positive: { color: Colors.success },
  negative: { color: Colors.danger },
  chartCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    paddingBottom: Spacing.sm,
  },
  barCol: { flex: 1, alignItems: 'center' },
  bar: {
    width: '60%',
    backgroundColor: Colors.orange,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.sm },
  legend: { marginTop: Spacing.md, alignItems: 'center' },
  legendText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  list: { gap: Spacing.sm },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  rankNum: { color: Colors.orange, fontSize: FontSizes.sm, fontWeight: '700', width: 30 },
  rankName: { flex: 1, color: Colors.textPrimary, fontSize: FontSizes.base },
  rankCount: { color: Colors.textMuted, fontSize: FontSizes.sm },
});

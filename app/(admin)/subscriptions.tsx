import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

export default function AdminSubscriptionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> Subscriptions</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: Colors.orange }]}>
            <Text style={styles.statEmoji}></Text>
            <Text style={styles.statValue}>412</Text>
            <Text style={styles.statLabel}>Pro Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}></Text>
            <Text style={styles.statValue}>2,435</Text>
            <Text style={styles.statLabel}>Free Users</Text>
          </View>
        </View>

        <View style={styles.revenueCard}>
          <Text style={styles.sectionTitle}> Revenue (Placeholder)</Text>
          <Text style={styles.revenueValue}>$12,360/mo</Text>
          <View style={styles.breakdown}>
            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Monthly Subscriptions</Text>
              <Text style={styles.breakValue}>$8,240</Text>
            </View>
            <View style={styles.breakRow}>
              <Text style={styles.breakLabel}>Annual Subscriptions</Text>
              <Text style={styles.breakValue}>$4,120</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Plan Changes</Text>
        <View style={styles.list}>
          {[
            { user: 'sarah@example.com', action: 'upgrade', time: '2h ago' },
            { user: 'mike@example.com', action: 'downgrade', time: '5h ago' },
            { user: 'jessica@example.com', action: 'renewal', time: '1d ago' },
          ].map((item, i) => (
            <View key={i} style={styles.changeRow}>
              <Text style={styles.changeEmoji}>{item.action === 'upgrade' ? '⬆' : item.action === 'downgrade' ? '⬇' : ''}</Text>
              <View style={styles.changeInfo}>
                <Text style={styles.changeText}>{item.user}</Text>
                <Text style={styles.changeMeta}>{item.action === 'upgrade' ? 'Upgraded to Pro' : item.action === 'downgrade' ? 'Downgraded to Free' : 'Annual renewal'} · {item.time}</Text>
              </View>
              <TouchableOpacity style={styles.changeBtn} onPress={() => {}}>
                <Text style={styles.changeBtnText}>Manage</Text>
              </TouchableOpacity>
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
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 24, marginBottom: Spacing.sm },
  statValue: { color: Colors.orange, fontSize: FontSizes.xl, fontWeight: '700' },
  statLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  revenueCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.md },
  revenueValue: { color: Colors.orange, fontSize: FontSizes['3xl'], fontWeight: '700', marginBottom: Spacing.md },
  breakdown: { gap: Spacing.sm },
  breakRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  breakValue: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: '600' },
  list: { gap: Spacing.sm },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  changeEmoji: { fontSize: 20, marginRight: Spacing.md },
  changeInfo: { flex: 1 },
  changeText: { color: Colors.textPrimary, fontSize: FontSizes.sm },
  changeMeta: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.xs },
  changeBtn: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  changeBtnText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
});

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Users', emoji: '👥', href: '/(admin)/users' as const },
  { label: 'Exercises', emoji: '🏋️', href: '/(admin)/exercises' as const },
  { label: 'Challenges', emoji: '🏆', href: '/(admin)/challenges' as const },
  { label: 'Subscriptions', emoji: '💳', href: '/(admin)/subscriptions' as const },
  { label: 'Analytics', emoji: '📊', href: '/(admin)/analytics' as const },
  { label: 'AI Prompts', emoji: '🤖', href: '/(admin)/ai-prompts' as const },
];

const recentActivity = [
  { emoji: '👤', text: 'New user registered: alex@example.com', time: '2m ago' },
  { emoji: '⭐', text: 'Pro upgrade: player@gravitygains.com', time: '15m ago' },
  { emoji: '🔥', text: 'Workout completed: 7-Day Wall Sit', time: '1h ago' },
  { emoji: '🏆', text: 'Challenge created: 5-Min Plank', time: '3h ago' },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [search, setSearch] = useState('');

  const handleBack = () => router.push('/(tabs)/dashboard');
  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🛡️ Admin Dashboard</Text>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBtn} onPress={handleBack}>
              <Text style={styles.headerBtnText}>← Back to App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtnDanger} onPress={handleSignOut}>
              <Text style={styles.headerBtnDangerText}>🚪 Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>2,847</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>412</Text>
            <Text style={styles.statLabel}>Pro Subscribers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>1,203</Text>
            <Text style={styles.statLabel}>Active Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚡</Text>
            <Text style={styles.statValue}>342</Text>
            <Text style={styles.statLabel}>Avg Gravity Score</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users, exercises, challenges..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.navGrid}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.navCard}
              onPress={() => router.push(item.href)}
            >
              <Text style={styles.navEmoji}>{item.emoji}</Text>
              <Text style={styles.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentActivity.map((act, i) => (
            <View key={i} style={styles.activityRow}>
              <Text style={styles.activityEmoji}>{act.emoji}</Text>
              <View style={styles.activityTextWrap}>
                <Text style={styles.activityText}>{act.text}</Text>
                <Text style={styles.activityTime}>{act.time}</Text>
              </View>
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
  header: { marginBottom: Spacing.lg },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700' },
  headerRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  headerBtn: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerBtnText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  headerBtnDanger: {
    backgroundColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  headerBtnDangerText: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: '600' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
  statCard: {
    flex: 1,
    minWidth: '45%',
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
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginTop: Spacing.lg, marginBottom: Spacing.md },
  searchInput: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
  },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  navCard: {
    width: '30%',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    alignItems: 'center',
  },
  navEmoji: { fontSize: 28, marginBottom: Spacing.sm },
  navLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, textAlign: 'center' },
  activityList: { gap: Spacing.sm },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  activityEmoji: { fontSize: 20, marginRight: Spacing.md },
  activityTextWrap: { flex: 1 },
  activityText: { color: Colors.textPrimary, fontSize: FontSizes.sm },
  activityTime: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.xs },
});

import { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const RECENT_ACTIVITIES = [
  { id: '1', title: 'Foundation 5 — Day 3', date: 'Today', duration: '28 min', route: '/programs' as const, emoji: '🏗️', difficulty: 'Beginner' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#4ADE80',
  Intermediate: '#FB923C',
  Advanced: '#EF4444',
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tapCount, setTapCount] = useState(0);

  const handleBrandTap = useCallback(() => {
    const next = tapCount + 1;
    setTapCount(next);
    if (user?.role === 'admin' && next >= 5) {
      setTapCount(0);
      router.push('/(admin)/dashboard');
    }
  }, [tapCount, user?.role, router]);

  const score = user?.gravityScore ?? 0;
  const streak = user?.workoutStreak ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Welcome Banner */}
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Welcome back, {user?.name || 'Athlete'}</Text>
          <TouchableOpacity onPress={handleBrandTap} activeOpacity={1}>
            <Image source={require('@/assets/images/logo.jpg')} style={styles.brandLogo} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Gravity Score Card */}
        <View style={styles.card}>
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreLabel}>Gravity Score</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: Colors.goldMuted }]}>
              <Text style={[styles.pillText, { color: Colors.gold }]}>🏆 Rank: {score > 800 ? 'Elite' : score > 400 ? 'Warrior' : 'Rookie'}</Text>
            </View>
          </View>
        </View>

        {/* Workout Streak */}
        <View style={styles.card}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.streakValue}>{streak} day streak</Text>
              <Text style={styles.streakSub}>Keep the momentum alive!</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.orangeMuted }]}
            onPress={() => router.push('/(tabs)/workouts')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionEmoji}>▶️</Text>
            <Text style={[styles.actionText, { color: Colors.orange }]}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: Colors.blueMuted }]}
            onPress={() => router.push('/(tabs)/library')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionEmoji}>📝</Text>
            <Text style={[styles.actionText, { color: Colors.blue }]}>Take Assessment</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {RECENT_ACTIVITIES.map((item) => {
          const dColor = DIFFICULTY_COLORS[item.difficulty] || Colors.orange;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.activityCard, { borderLeftColor: dColor }]}
              onPress={() => router.push(item.route)}
              activeOpacity={0.8}
            >
              <View style={styles.activityRow}>
                <Text style={styles.activityEmoji}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityMeta}>{item.date} • {item.duration}</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: `${dColor}20` }]}>
                  <Text style={[styles.difficultyText, { color: dColor }]}>{item.difficulty}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.nearBlack,
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  brandLogo: {
    width: 200,
    height: 60,
    marginTop: Spacing.sm,
  },
  brand: {
    fontSize: FontSizes.lg,
    color: Colors.orange,
    fontWeight: '800',
  },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: Spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  scoreValue: {
    fontSize: FontSizes['4xl'],
    color: Colors.orange,
    fontWeight: '900',
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  pillText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: FontSizes['3xl'],
    marginRight: Spacing.md,
  },
  streakValue: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  streakSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    borderRadius: 14,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionEmoji: {
    fontSize: FontSizes['2xl'],
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: FontSizes.base,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  activityCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderLeftWidth: 4,
    marginBottom: Spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  activityEmoji: {
    fontSize: 32,
  },
  activityTitle: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  activityMeta: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
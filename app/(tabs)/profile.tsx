import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const SCORE_HISTORY = [
  { month: 'Jan', score: 200 },
  { month: 'Feb', score: 280 },
  { month: 'Mar', score: 350 },
  { month: 'Apr', score: 420 },
  { month: 'May', score: 480 },
  { month: 'Jun', score: 520 },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const maxScore = Math.max(...SCORE_HISTORY.map((s) => s.score), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user?.name || 'Athlete'}</Text>
              <Text style={styles.email}>{user?.email || ''}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{user?.role === 'admin' ? '🔒 Admin' : '👤 Player'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Gravity Score History Sparkline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>📈 Gravity Score History</Text>
          <View style={styles.sparkContainer}>
            {SCORE_HISTORY.map((item, index) => {
              const heightPercent = (item.score / maxScore) * 100;
              return (
                <View key={item.month} style={styles.barWrap}>
                  <View style={[styles.bar, { height: `${heightPercent}%` }]} />
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>18h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
        </View>

        {/* Settings */}
        <TouchableOpacity
          style={[styles.card, styles.listItem]}
          onPress={() => {
            // Navigate to settings if it exists in future
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.listText}>⚙️ Settings</Text>
          <Text style={styles.listArrow}>›</Text>
        </TouchableOpacity>

        {/* Log Out */}
        <TouchableOpacity
          style={[styles.card, styles.logoutCard]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  avatarText: {
    fontSize: FontSizes.xl,
    color: '#fff',
    fontWeight: '800',
  },
  name: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  email: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  roleBadge: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: Colors.darkElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  roleText: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  sparkContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: 12,
    backgroundColor: Colors.orange,
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    color: Colors.orange,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listText: {
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  listArrow: {
    fontSize: FontSizes.xl,
    color: Colors.textMuted,
  },
  logoutCard: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: 'rgba(239,68,68,0.3)',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: FontSizes.base,
    color: Colors.danger,
    fontWeight: '700',
  },
});

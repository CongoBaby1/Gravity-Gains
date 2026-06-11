import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: '#4ADE80',
  Intermediate: '#FB923C',
  Advanced: '#EF4444',
  Any: Colors.orange,
};

const WORKOUTS = [
  {
    id: '1',
    name: 'Foundation 5',
    slug: 'programs',
    isProgram: true,
    duration: '30 min',
    difficulty: 'Beginner',
    muscles: 'Full Body',
    emoji: '🏗️',
  },
  {
    id: '6',
    name: 'Build Session',
    slug: 'build-session',
    isProgram: false,
    duration: 'Custom',
    difficulty: 'Any',
    muscles: 'You Choose',
    emoji: '⚙️',
  },
];

export default function WorkoutsScreen() {
  const router = useRouter();

  const handleStart = (w: typeof WORKOUTS[0]) => {
    if (w.isProgram) {
      router.push('/programs');
      return;
    }
    if (w.slug === 'build-session') {
      router.push('/build-session');
      return;
    }
    router.push(`/exercise/${w.slug}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>💪 Workouts</Text>
        <Text style={styles.sub}>Choose a session to begin</Text>

        {WORKOUTS.map((w) => {
          const dColor = DIFFICULTY_COLORS[w.difficulty] || Colors.orange;
          return (
            <TouchableOpacity
              key={w.id}
              style={[styles.card, { borderLeftColor: dColor }]}
              activeOpacity={0.8}
              onPress={() => handleStart(w)}
            >
              <View style={styles.row}>
                <View style={[styles.badge, { backgroundColor: `${dColor}20` }]}>
                  <Text style={[styles.badgeText, { color: dColor }]}>{w.difficulty}</Text>
                </View>
                <Text style={styles.duration}>⏱️ {w.duration}</Text>
              </View>

              <Text style={styles.emoji}>{w.emoji}</Text>
              <Text style={styles.name}>{w.name}</Text>
              <Text style={styles.muscles}>🎯 {w.muscles}</Text>

              <View style={[styles.button, { backgroundColor: dColor }]}>
                <Text style={styles.buttonText}>Start Session</Text>
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
    fontSize: FontSizes['3xl'],
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  sub: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderLeftWidth: 4,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  duration: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  emoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  muscles: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  button: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: FontSizes.base,
  },
});

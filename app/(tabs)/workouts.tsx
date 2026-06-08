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

const WORKOUTS = [
  {
    id: '1',
    name: 'Foundation 5',
    slug: 'programs',
    isProgram: true,
    duration: '30 min',
    difficulty: 'Beginner',
    muscles: 'Full Body',
    color: Colors.orange,
  },
  {
    id: '2',
    name: 'Mobility Flow - Hips',
    slug: 'hip',
    isProgram: false,
    duration: '15 min',
    difficulty: 'Beginner',
    muscles: 'Hips, Core',
    color: Colors.blue,
  },
  {
    id: '3',
    name: 'Push Pull Ladder',
    slug: 'push-pull-ladder',
    isProgram: false,
    duration: '40 min',
    difficulty: 'Intermediate',
    muscles: 'Upper Body',
    color: Colors.gold,
  },
  {
    id: '4',
    name: 'Posterior Chain Power',
    slug: 'posterior-power',
    isProgram: false,
    duration: '35 min',
    difficulty: 'Intermediate',
    muscles: 'Back, Glutes, Hamstrings',
    color: Colors.success,
  },
  {
    id: '5',
    name: 'Core Crusher',
    slug: 'core-crusher',
    isProgram: false,
    duration: '20 min',
    difficulty: 'Advanced',
    muscles: 'Core',
    color: Colors.danger,
  },
  {
    id: '6',
    name: 'Build Session',
    slug: 'build-session',
    isProgram: false,
    duration: 'Custom',
    difficulty: 'Any',
    muscles: 'You Choose',
    color: Colors.warning,
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
    router.push(`/workout/${w.slug}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>💪 Workouts</Text>
        <Text style={styles.sub}>Choose a session to begin</Text>

        {WORKOUTS.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => handleStart(w)}
          >
            <View style={styles.row}>
              <View style={[styles.badge, { backgroundColor: `${w.color}20` }]}>
                <Text style={[styles.badgeText, { color: w.color }]}>{w.difficulty}</Text>
              </View>
              <Text style={styles.duration}>⏱️ {w.duration}</Text>
            </View>

            <Text style={styles.name}>{w.name}</Text>
            <Text style={styles.muscles}>🎯 {w.muscles}</Text>

            <View style={[styles.button, { backgroundColor: w.color }]}>
              <Text style={styles.buttonText}>Start Session</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    color: '#fff',
    fontWeight: '800',
    fontSize: FontSizes.base,
  },
});

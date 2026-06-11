import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

export default function MobilityScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.emoji}>🧘</Text>
        <Text style={styles.header}>Mobility Stretching</Text>
        <Text style={styles.sub}>Flexibility & range-of-motion routines</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardBody}>
            We’re building out mobility flows — hip openers, spinal sequences, and ankle drills. 
            Check back after the next drop.
          </Text>
        </View>

        <View style={styles.spacer} />

        <Text onPress={() => router.back()} style={styles.back}>
          ← Back to Workouts
        </Text>
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
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  header: {
    fontSize: FontSizes['3xl'],
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  sub: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  cardTitle: {
    fontSize: FontSizes.xl,
    color: Colors.orange,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  cardBody: {
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  spacer: {
    height: Spacing.xxl,
  },
  back: {
    fontSize: FontSizes.base,
    color: Colors.textMuted,
    marginTop: Spacing.lg,
  },
});

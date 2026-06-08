import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const CATEGORY_META: Record<string, { color: string; emoji: string }> = {
  Legs: { color: '#FF6B35', emoji: '🦵' },
  Core: { color: '#4ECDC4', emoji: '📏' },
  'Upper Body': { color: '#45B7D1', emoji: '💪' },
  'Posterior Chain': { color: '#96CEB4', emoji: '🦸' },
  Mobility: { color: '#DDA0DD', emoji: '🔄' },
};

const EXERCISES = [
  { id: 'wall-sit', name: 'Wall Sit', muscles: 'Quads, Glutes', difficulty: 'Beginner', category: 'Legs', emoji: '🪑' },
  { id: 'plank', name: 'Dead-Stop Plank', muscles: 'Core, Abs', difficulty: 'Beginner', category: 'Core', emoji: '📏' },
  { id: 'superman', name: 'Superman Hold', muscles: 'Lower Back, Glutes', difficulty: 'Beginner', category: 'Posterior Chain', emoji: '🦸' },
  { id: 'push-up-hold', name: 'Mid-Range Push-Up Hold', muscles: 'Chest, Triceps', difficulty: 'Intermediate', category: 'Upper Body', emoji: '💪' },
  { id: 'horse-stance', name: 'Horse Stance', muscles: 'Adductors, Quads', difficulty: 'Intermediate', category: 'Legs', emoji: '🐴' },
  { id: 'air-squat', name: 'Air Squat', muscles: 'Legs', difficulty: 'Beginner', category: 'Legs', emoji: '🦵' },
  { id: 'lunge-walk', name: 'Lunge Walk', muscles: 'Legs, Glutes', difficulty: 'Beginner', category: 'Legs', emoji: '🚶' },
  { id: 'hollow-body', name: 'Hollow Body Hold', muscles: 'Core', difficulty: 'Intermediate', category: 'Core', emoji: '🍩' },
  { id: 'pull-up', name: 'Pull-Up', muscles: 'Back, Biceps', difficulty: 'Intermediate', category: 'Upper Body', emoji: '🤸' },
  { id: 'inverted-row', name: 'Inverted Row', muscles: 'Back, Biceps', difficulty: 'Beginner', category: 'Upper Body', emoji: '📐' },
  { id: 'glute-bridge', name: 'Glute Bridge', muscles: 'Glutes, Hamstrings', difficulty: 'Beginner', category: 'Posterior Chain', emoji: '🍑' },
  { id: 'single-leg-rdl', name: 'Single-Leg RDL', muscles: 'Hamstrings, Glutes', difficulty: 'Intermediate', category: 'Posterior Chain', emoji: '🦵' },
  { id: '90-hip', name: '90/90 Hip Switch', muscles: 'Hips', difficulty: 'Beginner', category: 'Mobility', emoji: '🔄' },
  { id: 'cat-cow', name: 'Cat-Cow', muscles: 'Spine, Core', difficulty: 'Beginner', category: 'Mobility', emoji: '🐈' },
  { id: 'deep-squat', name: 'Deep Squat Hold', muscles: 'Hips, Ankles', difficulty: 'Beginner', category: 'Mobility', emoji: '🪑' },
];

const CATEGORIES = ['All', 'Legs', 'Core', 'Upper Body', 'Posterior Chain', 'Mobility'];

export default function LibraryScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = EXERCISES.filter((ex) => {
    const matchesCategory = activeCategory === 'All' || ex.category === activeCategory;
    const matchesSearch = ex.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const gap = Spacing.md;
  const padding = Spacing.lg;
  const cardWidth = (screenWidth - padding * 2 - gap) / 2;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={[styles.scroll, { width: screenWidth }]}
      >
        <Text style={styles.header}>Exercise Library</Text>
        <Text style={styles.sub}>Explore movements by category</Text>

        <TextInput
          style={styles.search}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            const meta = CATEGORY_META[cat] || { color: Colors.orange, emoji: '🏋️' };
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  active && { backgroundColor: meta.color, borderColor: meta.color },
                ]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipEmoji, active && { opacity: 1 }]}>
                  {meta.emoji}
                </Text>
                <Text
                  style={[
                    styles.chipText,
                    active && { color: '#000', fontWeight: '700' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((ex) => {
            const meta = CATEGORY_META[ex.category] || { color: Colors.orange };
            return (
              <TouchableOpacity
                key={ex.id}
                activeOpacity={0.8}
                onPress={() => router.push(`/exercise/${ex.id}`)}
                style={[styles.card, { width: cardWidth, borderLeftColor: meta.color }]}
              >
                <Text style={styles.cardEmoji}>{ex.emoji}</Text>
                <Text style={styles.cardTitle}>{ex.name}</Text>
                <Text style={styles.cardMeta}>{ex.muscles}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: `${meta.color}20` }]}>
                    <Text style={[styles.badgeText, { color: meta.color }]}>{ex.difficulty}</Text>
                  </View>
                  <Text style={[styles.catText, { color: meta.color }]}>{ex.category}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  search: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    marginBottom: Spacing.md,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipEmoji: {
    fontSize: 14,
    opacity: 0.7,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderLeftWidth: 4,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  cardMeta: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  catText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});

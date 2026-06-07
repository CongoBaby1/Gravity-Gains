import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

const EXERCISES = [
  { id: '1', name: 'Air Squat', muscles: 'Legs', difficulty: 'Beginner', category: 'Legs' },
  { id: '2', name: 'Lunge Walk', muscles: 'Legs, Glutes', difficulty: 'Beginner', category: 'Legs' },
  { id: '3', name: 'Plank', muscles: 'Core', difficulty: 'Beginner', category: 'Core' },
  { id: '4', name: 'Hollow Body Hold', muscles: 'Core', difficulty: 'Intermediate', category: 'Core' },
  { id: '5', name: 'Push-Up', muscles: 'Chest, Triceps', difficulty: 'Beginner', category: 'Upper Body' },
  { id: '6', name: 'Pull-Up', muscles: 'Back, Biceps', difficulty: 'Intermediate', category: 'Upper Body' },
  { id: '7', name: 'Inverted Row', muscles: 'Back, Biceps', difficulty: 'Beginner', category: 'Upper Body' },
  { id: '8', name: 'Glute Bridge', muscles: 'Glutes, Hamstrings', difficulty: 'Beginner', category: 'Posterior Chain' },
  { id: '9', name: 'Single-Leg RDL', muscles: 'Hamstrings, Glutes', difficulty: 'Intermediate', category: 'Posterior Chain' },
  { id: '10', name: '90/90 Hip Switch', muscles: 'Hips', difficulty: 'Beginner', category: 'Mobility' },
  { id: '11', name: 'Cat-Cow', muscles: 'Spine, Core', difficulty: 'Beginner', category: 'Mobility' },
  { id: '12', name: 'Deep Squat Hold', muscles: 'Hips, Ankles', difficulty: 'Beginner', category: 'Mobility' },
];

const CATEGORIES = ['All', 'Legs', 'Core', 'Upper Body', 'Posterior Chain', 'Mobility'];

export default function LibraryScreen() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = EXERCISES.filter((ex) => {
    const matchesCategory = activeCategory === 'All' || ex.category === activeCategory;
    const matchesSearch = ex.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>📚 Exercise Library</Text>
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
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  active && { backgroundColor: Colors.orange, borderColor: Colors.orange },
                ]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && { color: '#fff', fontWeight: '700' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((ex) => (
            <View key={ex.id} style={styles.card}>
              <Text style={styles.cardTitle}>{ex.name}</Text>
              <Text style={styles.cardMeta}>🎯 {ex.muscles}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: Colors.darkElevated }]}>
                  <Text style={styles.badgeText}>{ex.difficulty}</Text>
                </View>
                <Text style={styles.badgeText}>{ex.category}</Text>
              </View>
            </View>
          ))}
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
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
    width: '47%',
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
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});

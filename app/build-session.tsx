import { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  { id: '13', name: 'Burpee', muscles: 'Full Body', difficulty: 'Advanced', category: 'Full Body' },
  { id: '14', name: 'Mountain Climber', muscles: 'Core, Shoulders', difficulty: 'Intermediate', category: 'Core' },
  { id: '15', name: 'Jump Squat', muscles: 'Legs, Glutes', difficulty: 'Intermediate', category: 'Legs' },
  { id: '16', name: 'Box Jump', muscles: 'Legs, Glutes', difficulty: 'Intermediate', category: 'Legs' },
  { id: '17', name: 'Handstand Hold', muscles: 'Shoulders, Core', difficulty: 'Advanced', category: 'Upper Body' },
  { id: '18', name: 'L-Sit', muscles: 'Core, Hip Flexors', difficulty: 'Advanced', category: 'Core' },
];

const CATEGORIES = ['All', 'Legs', 'Core', 'Upper Body', 'Posterior Chain', 'Mobility', 'Full Body'];

export default function BuildSessionScreen() {
  const router = useRouter();

  const [step, setStep] = useState<'pick' | 'configure'>('pick');
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const [workTime, setWorkTime] = useState('40');
  const [restTime, setRestTime] = useState('20');
  const [rounds, setRounds] = useState('4');
  const [sessionName, setSessionName] = useState('');

  const toggleExercise = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const filtered = EXERCISES.filter((ex) => {
    const matchesCategory = activeCategory === 'All' || ex.category === activeCategory;
    const matchesSearch = ex.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedExercises = EXERCISES.filter((ex) => selected.includes(ex.id));

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Select Exercises', 'Pick at least one exercise to build a session.');
      return;
    }
    setStep('configure');
  };

  const handleStart = () => {
    const name = sessionName.trim() || `Build Session`;
    const w = parseInt(workTime, 10) || 40;
    const r = parseInt(restTime, 10) || 20;
    const roundCount = parseInt(rounds, 10) || 4;

    // Navigate to the voice workout with the custom config
    router.push({
      pathname: '/voice-workout',
      params: {
        name,
        exercises: JSON.stringify(selectedExercises.map((e) => e.name)),
        workTime: String(w),
        restTime: String(r),
        rounds: String(roundCount),
      },
    });
  };

  if (step === 'pick') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Build Session</Text>
          <Text style={styles.sub}>Pick exercises for your interval session</Text>

          <TextInput
            style={styles.search}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, active && { backgroundColor: Colors.orange, borderColor: Colors.orange }]}
                  onPress={() => setActiveCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, active && { color: '#fff', fontWeight: '700' }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.selectionBar}>
            <Text style={styles.selectionText}>
              {selected.length} selected{selected.length > 0 ? ` · ${selected.length * 2} min est.` : ''}
            </Text>
          </View>

          {filtered.map((ex) => {
            const isSelected = selected.includes(ex.id);
            return (
              <TouchableOpacity
                key={ex.id}
                style={[styles.exerciseCard, isSelected && styles.exerciseCardActive]}
                onPress={() => toggleExercise(ex.id)}
                activeOpacity={0.8}
              >
                <View style={styles.exerciseRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseMeta}>{ex.muscles} · {ex.difficulty}</Text>
                  </View>
                  <View style={[styles.checkCircle, isSelected && { backgroundColor: Colors.orange, borderColor: Colors.orange }]}>
                    {isSelected && <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>Next: Configure Intervals</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => setStep('pick')} style={styles.back} activeOpacity={0.7}>
          <Text style={styles.backText}>‹ Back to Exercise Selection</Text>
        </TouchableOpacity>

        <Text style={styles.header}>Configure Session</Text>
        <Text style={styles.sub}>{selectedExercises.length} exercises · Set your intervals</Text>

        <Text style={styles.label}>Session Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Morning Burn"
          placeholderTextColor={Colors.textMuted}
          value={sessionName}
          onChangeText={setSessionName}
          maxLength={30}
        />

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Work (sec)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="40"
              placeholderTextColor={Colors.textMuted}
              value={workTime}
              onChangeText={setWorkTime}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Rest (sec)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="20"
              placeholderTextColor={Colors.textMuted}
              value={restTime}
              onChangeText={setRestTime}
            />
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Rounds</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="4"
              placeholderTextColor={Colors.textMuted}
              value={rounds}
              onChangeText={setRounds}
            />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Session Preview</Text>
          {selectedExercises.map((ex) => (
            <View key={ex.id} style={styles.summaryRow}>
              <Text style={styles.summaryDot}>•</Text>
              <Text style={styles.summaryExercise}>{ex.name}</Text>
              <Text style={styles.summaryInterval}>{workTime}s work / {restTime}s rest</Text>
            </View>
          ))}
          <Text style={styles.summaryTotal}>
            {rounds} rounds · ~{Math.ceil(((parseInt(workTime) + parseInt(restTime)) * selectedExercises.length * parseInt(rounds)) / 60)} min
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { fontSize: FontSizes['3xl'], color: Colors.textPrimary, fontWeight: '800', marginBottom: Spacing.xs },
  sub: { fontSize: FontSizes.lg, color: Colors.textSecondary, marginBottom: Spacing.xl },
  search: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    marginBottom: Spacing.md,
  },
  chips: { flexDirection: 'row', gap: Spacing.sm, paddingBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    backgroundColor: Colors.darkElevated,
  },
  chipText: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  selectionBar: { marginBottom: Spacing.md },
  selectionText: { fontSize: FontSizes.sm, color: Colors.orange, fontWeight: '700' },
  exerciseCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: Spacing.sm,
  },
  exerciseCardActive: { borderColor: Colors.orange, backgroundColor: `${Colors.orange}12` },
  exerciseRow: { flexDirection: 'row', alignItems: 'center' },
  exerciseName: { fontSize: FontSizes.base, color: Colors.textPrimary, fontWeight: '700' },
  exerciseMeta: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.darkBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  nextButtonText: { color: '#000', fontWeight: '800', fontSize: FontSizes.lg },
  back: { marginBottom: Spacing.md },
  backText: { color: Colors.orange, fontSize: FontSizes.base, fontWeight: '700' },
  label: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, fontWeight: '600' },
  input: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    marginBottom: Spacing.lg,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  col: { flex: 1 },
  summaryCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    marginBottom: Spacing.xl,
  },
  summaryTitle: { fontSize: FontSizes.lg, color: Colors.textPrimary, fontWeight: '800', marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs },
  summaryDot: { color: Colors.orange, marginRight: Spacing.sm, fontSize: FontSizes.sm },
  summaryExercise: { flex: 1, fontSize: FontSizes.base, color: Colors.textPrimary },
  summaryInterval: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  summaryTotal: { fontSize: FontSizes.sm, color: Colors.gold, fontWeight: '700', marginTop: Spacing.md },
  startButton: {
    backgroundColor: Colors.orange,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  startButtonText: { color: '#000', fontWeight: '800', fontSize: FontSizes.lg },
});

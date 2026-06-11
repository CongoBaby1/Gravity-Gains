import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscles: string[];
}

const CATEGORIES = ['All', 'Core', 'Upper Body', 'Lower Body', 'Full Body', 'Cardio', 'Mobility'];

const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Wall Sit', category: 'Lower Body', difficulty: 'beginner', muscles: ['Quads', 'Glutes'] },
  { id: '2', name: 'Plank', category: 'Core', difficulty: 'beginner', muscles: ['Core', 'Shoulders'] },
  { id: '3', name: 'Horse Stance', category: 'Lower Body', difficulty: 'intermediate', muscles: ['Quads', 'Adductors'] },
  { id: '4', name: 'Push-Up Hold', category: 'Upper Body', difficulty: 'intermediate', muscles: ['Chest', 'Triceps'] },
  { id: '5', name: 'Superman Hold', category: 'Core', difficulty: 'beginner', muscles: ['Lower Back', 'Glutes'] },
  { id: '6', name: 'Hip Mobility', category: 'Mobility', difficulty: 'beginner', muscles: ['Hip Flexors', 'Glutes'] },
];

export default function AdminExercisesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Core');
  const [newDifficulty, setNewDifficulty] = useState('beginner');

  const filtered = MOCK_EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || ex.category === category;
    return matchesSearch && matchesCat;
  });

  const difficultyColor = (d: string) => {
    if (d === 'beginner') return Colors.success;
    if (d === 'intermediate') return Colors.warning;
    return Colors.danger;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> Exercises</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          <View style={styles.catRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, category === c && styles.catChipActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(!showAdd)}>
          <Text style={styles.addBtnText}>{showAdd ? '− Cancel' : '+ Add Exercise'}</Text>
        </TouchableOpacity>

        {showAdd && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={Colors.textMuted}
              value={newName}
              onChangeText={setNewName}
            />
            <Text style={styles.label}>Category</Text>
            <View style={styles.selectRow}>
              {['Core', 'Upper Body', 'Lower Body', 'Full Body', 'Cardio', 'Mobility'].map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.selectChip, newCategory === c && styles.selectChipActive]}
                  onPress={() => setNewCategory(c)}
                >
                  <Text style={newCategory === c ? styles.selectChipTextActive : styles.selectChipText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Difficulty</Text>
            <View style={styles.selectRow}>
              {['beginner', 'intermediate', 'advanced'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.selectChip, newDifficulty === d && styles.selectChipActive]}
                  onPress={() => setNewDifficulty(d)}
                >
                  <Text style={newDifficulty === d ? styles.selectChipTextActive : styles.selectChipText}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={() => setShowAdd(false)}>
              <Text style={styles.saveBtnText}> Save</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.list}>
          {filtered.map((ex) => (
            <View key={ex.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.exInfo}>
                  <Text style={styles.exName}>{ex.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>{ex.category}</Text>
                    <Text style={[styles.meta, { color: difficultyColor(ex.difficulty) }]}>{ex.difficulty}</Text>
                  </View>
                  <Text style={styles.muscles}> {ex.muscles.join(', ')}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                  <Text style={styles.actionText}> Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={() => {}}>
                  <Text style={styles.actionTextDanger}> Delete</Text>
                </TouchableOpacity>
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
  header: { marginBottom: Spacing.md },
  back: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.sm },
  title: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700' },
  search: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    marginBottom: Spacing.md,
  },
  catScroll: { marginBottom: Spacing.md },
  catRow: { flexDirection: 'row', gap: Spacing.sm },
  catChip: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  catChipActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  catChipText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  catChipTextActive: { color: Colors.nearBlack, fontWeight: '600' },
  addBtn: {
    backgroundColor: Colors.success,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addBtnText: { color: Colors.nearBlack, fontSize: FontSizes.base, fontWeight: '600' },
  form: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  formTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.md },
  input: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    marginBottom: Spacing.md,
  },
  label: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.sm },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  selectChip: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  selectChipActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  selectChipText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  selectChipTextActive: { color: Colors.nearBlack, fontSize: FontSizes.sm, fontWeight: '600' },
  saveBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveBtnText: { color: Colors.nearBlack, fontSize: FontSizes.base, fontWeight: '600' },
  list: { gap: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  exInfo: { flex: 1 },
  exName: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '600' },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  meta: { color: Colors.textMuted, fontSize: FontSizes.xs },
  muscles: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  actionBtnDanger: { borderColor: Colors.danger },
  actionText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  actionTextDanger: { color: Colors.danger, fontSize: FontSizes.sm },
});

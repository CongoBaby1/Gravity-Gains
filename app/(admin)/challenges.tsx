import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface Challenge {
  id: string;
  name: string;
  duration: string;
  description: string;
  participants: number;
  active: boolean;
}

const INITIAL_CHALLENGES: Challenge[] = [
  { id: '1', name: '7-Day Wall Sit', duration: '7 days', description: 'Hold a wall sit every day for 7 days. Progressively increase duration.', participants: 1240, active: true },
  { id: '2', name: '30-Day Core', duration: '30 days', description: 'Daily core workout challenge with progressive difficulty.', participants: 892, active: true },
  { id: '3', name: 'Horse Stance Mastery', duration: '21 days', description: 'Build lower body endurance with daily horse stance holds.', participants: 456, active: true },
  { id: '4', name: '100-Day Consistency', duration: '100 days', description: 'Complete at least one workout every day for 100 days straight.', participants: 203, active: false },
  { id: '5', name: '5-Min Plank', duration: '14 days', description: 'Work up to holding a 5-minute plank by day 14.', participants: 678, active: true },
];

export default function AdminChallengesScreen() {
  const router = useRouter();
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [editingId, setEditingId] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const toggleActive = (id: string) => {
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };

  const startEdit = (c: Challenge) => {
    setEditingId(c.id);
    setEditDesc(c.description);
  };

  const saveEdit = (id: string) => {
    setChallenges((prev) => prev.map((c) => c.id === id ? { ...c, description: editDesc } : c));
    setEditingId('');
    setEditDesc('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> Challenges</Text>
        </View>

        <View style={styles.list}>
          {challenges.map((c) => (
            <View key={c.id} style={[styles.card, !c.active && styles.cardInactive]}>
              <View style={styles.rowTop}>
                <View style={styles.badgeWrap}>
                  <Text style={styles.badge}>{c.active ? ' Active' : ' Inactive'}</Text>
                </View>
                <Switch
                  value={c.active}
                  onValueChange={() => toggleActive(c.id)}
                  trackColor={{ false: Colors.textMuted, true: Colors.orange }}
                  thumbColor={Colors.textPrimary}
                />
              </View>

              <Text style={styles.name}>{c.name}</Text>
              <Text style={styles.meta}> {c.duration} ·  {c.participants} participants</Text>

              {editingId === c.id ? (
                <View style={styles.editWrap}>
                  <TextInput
                    style={styles.textarea}
                    multiline
                    value={editDesc}
                    onChangeText={setEditDesc}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => saveEdit(c.id)}>
                      <Text style={styles.saveText}> Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingId('')}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <Text style={styles.desc}>{c.description}</Text>
              )}

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => startEdit(c)}>
                  <Text style={styles.actionText}> Edit Desc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                  <Text style={styles.actionText}> Participants</Text>
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
  list: { gap: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  cardInactive: { opacity: 0.7, borderColor: Colors.textMuted },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  badgeWrap: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  badge: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  name: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600' },
  meta: { color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  desc: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.sm, lineHeight: 20 },
  editWrap: { marginTop: Spacing.sm },
  textarea: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  saveBtn: {
    flex: 1,
    backgroundColor: Colors.orange,
    borderRadius: 10,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  saveText: { color: Colors.nearBlack, fontSize: FontSizes.sm, fontWeight: '600' },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  cancelText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
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

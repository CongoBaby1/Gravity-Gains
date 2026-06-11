import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface Prompt {
  id: string;
  name: string;
  content: string;
}

const INITIAL_PROMPTS: Prompt[] = [
  {
    id: '1',
    name: 'Workout Suggestion',
    content: 'You are the Gravity Gains AI Coach. Suggest a bodyweight workout based on the user\'s goals, experience, and available equipment. Keep it under 200 words.',
  },
  {
    id: '2',
    name: 'Form Check',
    content: 'You are the Gravity Gains AI Coach. Analyze the user\'s described exercise form and give 3 concise improvement tips.',
  },
  {
    id: '3',
    name: 'Motivation Boost',
    content: 'You are the Gravity Gains AI Coach. Give a short, energetic motivational message tailored to the user\'s streak and recent progress.',
  },
  {
    id: '4',
    name: 'Recovery Advice',
    content: 'You are the Gravity Gains AI Coach. Provide recovery tips based on the user\'s recent workout intensity and reported soreness.',
  },
];

export default function AdminAiPromptsScreen() {
  const router = useRouter();
  const [prompts, setPrompts] = useState(INITIAL_PROMPTS);
  const [editingId, setEditingId] = useState('');
  const [editContent, setEditContent] = useState('');

  const startEdit = (p: Prompt) => {
    setEditingId(p.id);
    setEditContent(p.content);
  };

  const saveEdit = (id: string) => {
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, content: editContent } : p));
    setEditingId('');
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingId('');
    setEditContent('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> AI Prompts</Text>
        </View>

        <View style={styles.list}>
          {prompts.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.promptName}>{p.name}</Text>
              {editingId === p.id ? (
                <View style={styles.editWrap}>
                  <TextInput
                    style={styles.textarea}
                    multiline
                    value={editContent}
                    onChangeText={setEditContent}
                  />
                  <View style={styles.editActions}>
                    <TouchableOpacity style={styles.saveBtn} onPress={() => saveEdit(p.id)}>
                      <Text style={styles.saveText}> Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.promptContent}>{p.content}</Text>
                  <TouchableOpacity style={styles.editBtn} onPress={() => startEdit(p)}>
                    <Text style={styles.editText}> Edit Prompt</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  promptName: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginBottom: Spacing.sm },
  promptContent: { color: Colors.textSecondary, fontSize: FontSizes.sm, lineHeight: 20 },
  editWrap: { marginTop: Spacing.sm },
  textarea: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
    minHeight: 100,
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
  editBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  editText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
});

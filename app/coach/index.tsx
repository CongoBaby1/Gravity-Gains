import { useState, useRef, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, StyleSheet, FlatList } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'coach';
  text: string;
}

const QUICK_ACTIONS = [
  { label: 'Start workout', icon: '▶️' },
  { label: 'Explain Wall Sit', icon: '🪑' },
  { label: 'My progress', icon: '📊' },
  { label: 'Motivate me', icon: '💪' },
];

function coachReply(userText: string, user: ReturnType<typeof useAuth>['user']): string {
  const t = userText.toLowerCase();
  if (t.includes('workout') || t.includes('start')) return 'Let\'s crush it! I recommend starting with Wall Sit for 60 seconds. Tap Programs to begin a session.';
  if (t.includes('wall sit') || t.includes('explain')) return 'Wall Sit: back flat against the wall, knees at 90°, arms relaxed. Hold as long as you can while breathing steady. Perfect for quads & glutes!';
  if (t.includes('progress')) {
    const score = user?.gravityScore ?? 0;
    return `Your Gravity Score is ${score}. You\'re improving week over week — keep the streak alive! 🔥`;
  }
  if (t.includes('motivat')) return 'Every second you hold is a vote for the person you want to become. You\'ve got this. 💪🔥';
  if (t.includes('hello') || t.includes('hi')) return `Hey ${user?.name ?? 'Athlete'}! I\'m Gravity Coach 🧠. How can I help you today?`;
  return 'I\'m here to help! Ask me about workouts, exercises, or your progress.';
}

export default function CoachScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'coach', text: `Hey ${user?.name ?? 'Athlete'}! I'm Gravity Coach 🧠. Ready to level up?` },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setTimeout(() => {
      const reply: Message = { id: (Date.now() + 1).toString(), role: 'coach', text: coachReply(text, user) };
      setMessages((prev) => [...prev, reply]);
    }, 700);
    setInput('');
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🧠</Text>
          <View>
            <Text style={styles.headerTitle}>Gravity Coach™</Text>
            <Text style={styles.headerStatus}>● Online</Text>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.sm }}
          renderItem={({ item }) => (
            <View style={[styles.bubbleRow, item.role === 'user' ? styles.bubbleRowRight : styles.bubbleRowLeft]}>
              {item.role === 'coach' && <Text style={styles.bubbleAvatar}>🧠</Text>}
              <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleCoach]}>
                <Text style={[styles.bubbleText, item.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextCoach]}>{item.text}</Text>
              </View>
            </View>
          )}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {QUICK_ACTIONS.map((chip) => (
            <TouchableOpacity key={chip.label} activeOpacity={0.7} onPress={() => send(chip.label)} style={styles.chip}>
              <Text style={styles.chipText}>{chip.icon} {chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Ask Gravity Coach..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <TouchableOpacity activeOpacity={0.7} onPress={() => send(input)} style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>➡️</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.darkBorder,
  },
  headerEmoji: { fontSize: FontSizes['3xl'] },
  headerTitle: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: '700' },
  headerStatus: { color: Colors.success, fontSize: FontSizes.sm, marginTop: 2 },
  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleAvatar: { fontSize: FontSizes.xl, marginRight: Spacing.sm },
  bubble: {
    maxWidth: '80%',
    borderRadius: 14,
    padding: Spacing.md,
  },
  bubbleCoach: {
    backgroundColor: Colors.darkCard,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.blue,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: FontSizes.base, lineHeight: 22 },
  bubbleTextCoach: { color: Colors.textPrimary },
  bubbleTextUser: { color: Colors.textPrimary },
  chips: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
  chip: {
    backgroundColor: Colors.darkCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chipText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.darkBorder,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.darkElevated,
    color: Colors.textPrimary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.base,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: { fontSize: FontSizes.lg },
});

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';
import { useAuth } from '../hooks/useAuth';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];
const EXPERIENCE_OPTIONS = ['beginner', 'intermediate', 'advanced'];
const GOALS_OPTIONS = ['Strength', 'Muscle Gain', 'Fat Loss', 'Endurance', 'Mobility', 'Calisthenics Skills'];
const EQUIPMENT_OPTIONS = ['None', 'Pull-up Bar', 'Rings', 'Parallettes', 'Resistance Bands', 'Dumbbells', 'Kettlebell'];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateUser, signOut } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [gender, setGender] = useState(user?.gender || '');
  const [genderOther, setGenderOther] = useState('');
  const [height, setHeight] = useState(user?.height ? String(user.height) : '');
  const [weight, setWeight] = useState(user?.weight ? String(user.weight) : '');
  const [goals, setGoals] = useState<string[]>(user?.goals || []);
  const [experience, setExperience] = useState(user?.experienceLevel || '');
  const [equipment, setEquipment] = useState<string[]>(user?.equipment || []);
  const [injuries, setInjuries] = useState(user?.injuries?.join(', ') || '');

  const [notifWorkout, setNotifWorkout] = useState(true);
  const [notifPR, setNotifPR] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifChallenges, setNotifChallenges] = useState(false);

  const toggleMulti = (val: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(val)) setter(list.filter((v) => v !== val));
    else setter([...list, val]);
  };

  const handleSave = async () => {
    await updateUser({
      name,
      age: age ? parseInt(age, 10) : undefined,
      gender: gender === 'Other' ? genderOther || 'Other' : gender,
      height: height ? parseInt(height, 10) : undefined,
      weight: weight ? parseInt(weight, 10) : undefined,
      goals,
      experienceLevel: experience as 'beginner' | 'intermediate' | 'advanced',
      equipment,
      injuries: injuries.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  const displayGender = gender;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>⚙️ Settings</Text>
        </View>

        {/* Profile */}
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.formCard}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="Years" placeholderTextColor={Colors.textMuted} />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.selectRow}>
            {GENDER_OPTIONS.map((g) => (
              <TouchableOpacity key={g} style={[styles.selectChip, displayGender === g && styles.selectChipActive]} onPress={() => setGender(g)}>
                <Text style={displayGender === g ? styles.selectChipTextActive : styles.selectChipText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {displayGender === 'Other' && (
            <TextInput
              style={[styles.input, { marginTop: Spacing.sm }]}
              value={genderOther}
              onChangeText={setGenderOther}
              placeholder="Please specify"
              placeholderTextColor={Colors.textMuted}
            />
          )}

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="cm" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={styles.half}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="kg" placeholderTextColor={Colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Goals */}
        <Text style={styles.sectionTitle}>Goals (Multi-select)</Text>
        <View style={styles.formCard}>
          <View style={styles.selectRow}>
            {GOALS_OPTIONS.map((g) => (
              <TouchableOpacity key={g} style={[styles.selectChip, goals.includes(g) && styles.selectChipActive]} onPress={() => toggleMulti(g, goals, setGoals)}>
                <Text style={goals.includes(g) ? styles.selectChipTextActive : styles.selectChipText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience */}
        <Text style={styles.sectionTitle}>Experience Level</Text>
        <View style={styles.formCard}>
          <View style={styles.selectRow}>
            {EXPERIENCE_OPTIONS.map((e) => (
              <TouchableOpacity key={e} style={[styles.selectChip, experience === e && styles.selectChipActive]} onPress={() => setExperience(e)}>
                <Text style={experience === e ? styles.selectChipTextActive : styles.selectChipText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Equipment */}
        <Text style={styles.sectionTitle}>Equipment Available (Multi-select)</Text>
        <View style={styles.formCard}>
          <View style={styles.selectRow}>
            {EQUIPMENT_OPTIONS.map((eq) => (
              <TouchableOpacity key={eq} style={[styles.selectChip, equipment.includes(eq) && styles.selectChipActive]} onPress={() => toggleMulti(eq, equipment, setEquipment)}>
                <Text style={equipment.includes(eq) ? styles.selectChipTextActive : styles.selectChipText}>{eq}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Injuries */}
        <Text style={styles.sectionTitle}>Injuries / Limitations</Text>
        <View style={styles.formCard}>
          <TextInput
            style={styles.textarea}
            multiline
            value={injuries}
            onChangeText={setInjuries}
            placeholder="Describe any injuries or physical limitations..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <View style={styles.formCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🔔 Workout Reminders</Text>
            <Switch value={notifWorkout} onValueChange={setNotifWorkout} trackColor={{ false: Colors.textMuted, true: Colors.orange }} thumbColor={Colors.textPrimary} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🎉 PR Alerts</Text>
            <Switch value={notifPR} onValueChange={setNotifPR} trackColor={{ false: Colors.textMuted, true: Colors.orange }} thumbColor={Colors.textPrimary} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🔥 Streak Warnings</Text>
            <Switch value={notifStreak} onValueChange={setNotifStreak} trackColor={{ false: Colors.textMuted, true: Colors.orange }} thumbColor={Colors.textPrimary} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>🏆 Challenge Updates</Text>
            <Switch value={notifChallenges} onValueChange={setNotifChallenges} trackColor={{ false: Colors.textMuted, true: Colors.orange }} thumbColor={Colors.textPrimary} />
          </View>
        </View>

        {/* Subscription */}
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={[styles.formCard, user?.isPro ? styles.proCard : styles.freeCard]}>
          <Text style={styles.subTitle}>{user?.isPro ? '⭐ Pro Plan' : '🆓 Free Plan'}</Text>
          <Text style={styles.subDesc}>{user?.isPro ? 'You have full access to all features.' : 'Upgrade to unlock advanced analytics, AI coaching, and all challenges.'}</Text>
          {!user?.isPro && (
            <TouchableOpacity style={styles.upgradeBtn} onPress={() => {}}>
              <Text style={styles.upgradeText}>⭐ Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>💾 Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>
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
  sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600', marginTop: Spacing.lg, marginBottom: Spacing.md },
  formCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  row: { flexDirection: 'row', gap: Spacing.md },
  half: { flex: 1 },
  label: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.darkElevated,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    color: Colors.textPrimary,
    padding: Spacing.md,
    fontSize: FontSizes.base,
  },
  selectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleLabel: { color: Colors.textPrimary, fontSize: FontSizes.base },
  proCard: { borderColor: Colors.gold },
  freeCard: { borderColor: Colors.darkBorder },
  subTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: '600' },
  subDesc: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  upgradeBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.orange,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
  },
  upgradeText: { color: Colors.nearBlack, fontSize: FontSizes.base, fontWeight: '600' },
  saveBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.orange,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
  },
  saveText: { color: Colors.nearBlack, fontSize: FontSizes.base, fontWeight: '600' },
  logoutBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.danger,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
  },
  logoutText: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '600' },
});

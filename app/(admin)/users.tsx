import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'admin';
  isPro: boolean;
  gravityScore: number;
}

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Test Player', email: 'player@gravitygains.com', role: 'player', isPro: false, gravityScore: 420 },
  { id: '2', name: 'Admin User', email: 'admin@gravitygains.com', role: 'admin', isPro: true, gravityScore: 875 },
  { id: '3', name: 'Sarah Chen', email: 'sarah@example.com', role: 'player', isPro: true, gravityScore: 650 },
  { id: '4', name: 'Mike Ross', email: 'mike@example.com', role: 'player', isPro: false, gravityScore: 210 },
  { id: '5', name: 'Jessica Lee', email: 'jessica@example.com', role: 'player', isPro: true, gravityScore: 780 },
];

export default function AdminUsersScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'player' | 'admin'>('all');

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}> Users</Text>
        </View>

        <TextInput
          style={styles.search}
          placeholder="Search by name or email..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterRow}>
          {(['all', 'player', 'admin'] as const).map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.filterChip, roleFilter === r && styles.filterChipActive]}
              onPress={() => setRoleFilter(r)}
            >
              <Text style={[styles.filterChipText, roleFilter === r && styles.filterChipTextActive]}>{r === 'all' ? 'All' : r === 'player' ? 'Players' : 'Admins'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.list}>
          {filtered.map((u) => (
            <View key={u.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{u.role === 'admin' ? '' : ''}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{u.name}</Text>
                  <Text style={styles.email}>{u.email}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.meta}>{u.isPro ? ' Pro' : ' Free'}</Text>
                    <Text style={styles.meta}> {u.gravityScore}</Text>
                    <Text style={[styles.meta, u.role === 'admin' && styles.metaAdmin]}>{u.role === 'admin' ? ' Admin' : ' Player'}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                  <Text style={styles.actionText}> View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                  <Text style={styles.actionText}> Edit Role</Text>
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
  filterRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  filterChip: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  filterChipActive: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  filterChipText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  filterChipTextActive: { color: Colors.nearBlack, fontWeight: '600' },
  list: { gap: Spacing.md },
  card: {
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarEmoji: { fontSize: 20 },
  info: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '600' },
  email: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs },
  meta: { color: Colors.textMuted, fontSize: FontSizes.xs },
  metaAdmin: { color: Colors.danger },
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

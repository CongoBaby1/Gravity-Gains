import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', icon: '', title: 'Workout Reminder', message: 'Your evening core session is waiting. 15 minutes to stronger abs!', time: '10 min ago', read: false },
  { id: '2', icon: '', title: 'New PR!', message: 'You held a 3-minute plank — a new personal record!', time: '2h ago', read: false },
  { id: '3', icon: '', title: 'Streak Warning', message: 'Complete a workout today to keep your 12-day streak alive.', time: '4h ago', read: true },
  { id: '4', icon: '', title: 'Challenge Update', message: '30-Day Core Challenge: Day 14 complete. You are 45% done!', time: '1d ago', read: true },
  { id: '5', icon: '', title: 'Coach Tip', message: 'Try elevating your feet for the next wall sit to increase difficulty.', time: '2d ago', read: true },
  { id: '6', icon: '', title: 'Friend Activity', message: 'Sarah Chen just joined the 7-Day Wall Sit challenge.', time: '3d ago', read: true },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markOneRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <Text style={styles.title}> Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={markAllRead}>
            <Text style={styles.actionText}> Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={clearAll}>
            <Text style={styles.actionTextDanger}> Clear All</Text>
          </TouchableOpacity>
        </View>

        {notifications.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}></Text>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}

        <View style={styles.list}>
          {notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.row, !n.read && styles.rowUnread]}
              onPress={() => markOneRead(n.id)}
            >
              <View style={[styles.iconWrap, !n.read && styles.iconWrapUnread]}>
                <Text style={styles.icon}>{n.icon}</Text>
              </View>
              <View style={styles.content}>
                <View style={styles.titleLine}>
                  <Text style={styles.rowTitle}>{n.title}</Text>
                  {!n.read && <View style={styles.dot} />}
                </View>
                <Text style={styles.rowMessage}>{n.message}</Text>
                <Text style={styles.rowTime}>{n.time}</Text>
              </View>
            </TouchableOpacity>
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
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { color: Colors.textPrimary, fontSize: FontSizes['2xl'], fontWeight: '700' },
  badge: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: { color: Colors.textPrimary, fontSize: FontSizes.xs, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  actionBtnDanger: { borderColor: Colors.danger },
  actionText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  actionTextDanger: { color: Colors.danger, fontSize: FontSizes.sm },
  empty: { alignItems: 'center', marginTop: Spacing.xxl },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { color: Colors.textMuted, fontSize: FontSizes.base },
  list: { gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.darkCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.darkBorder,
    padding: Spacing.md,
  },
  rowUnread: { borderColor: Colors.orange },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconWrapUnread: { backgroundColor: Colors.orangeMuted },
  icon: { fontSize: 20 },
  content: { flex: 1 },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowTitle: { color: Colors.textPrimary, fontSize: FontSizes.base, fontWeight: '600' },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.orange,
  },
  rowMessage: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs, lineHeight: 18 },
  rowTime: { color: Colors.textMuted, fontSize: FontSizes.xs, marginTop: Spacing.xs },
});

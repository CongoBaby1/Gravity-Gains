import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.darkElevated,
          borderTopColor: Colors.darkBorder,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.orange,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? Colors.orange : Colors.textMuted }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? Colors.orange : Colors.textMuted }}>💪</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? Colors.orange : Colors.textMuted }}>📚</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20, color: focused ? Colors.orange : Colors.textMuted }}>👤</Text>
          ),
        }}
      />
    </Tabs>
  );
}

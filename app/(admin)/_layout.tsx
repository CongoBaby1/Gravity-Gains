import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || user.role !== 'admin') {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0A0A0A' } }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="exercises" />
      <Stack.Screen name="challenges" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="ai-prompts" />
    </Stack>
  );
}

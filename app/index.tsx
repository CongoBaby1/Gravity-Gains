import { SafeAreaView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '@/constants/colors';

export default function LandingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🏋️‍♂️ GG</Text>
      <Text style={styles.title}>Gravity Gains</Text>
      <Text style={styles.tagline}>Master Your Own Weight</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.nearBlack, justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: FontSizes.hero, color: Colors.textPrimary, marginBottom: Spacing.md },
  title: { fontSize: FontSizes['3xl'], color: Colors.orange, fontWeight: '800', marginBottom: Spacing.sm },
  tagline: { fontSize: FontSizes.lg, color: Colors.textSecondary, marginBottom: Spacing.xxl },
  button: { backgroundColor: Colors.orange, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg, borderRadius: 14 },
  buttonText: { color: '#000', fontWeight: '800', fontSize: FontSizes.lg },
});

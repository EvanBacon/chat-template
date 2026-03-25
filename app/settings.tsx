import { platformColor } from "@/components/platform-color";
import { ScrollView, View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: platformColor('systemBackground') }}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        style={{
          backgroundColor: platformColor('secondarySystemBackground'),
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: platformColor('label'), marginBottom: 8 }}>
          Chat
        </Text>
        <Text style={{ fontSize: 15, color: platformColor('secondaryLabel'), lineHeight: 22 }}>
          Mock responses for demo purposes
        </Text>
      </View>

      <View
        style={{
          backgroundColor: platformColor('secondarySystemBackground'),
          borderRadius: 12,
          borderCurve: 'continuous',
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: platformColor('label'), marginBottom: 8 }}>
          About
        </Text>
        <Text style={{ fontSize: 15, color: platformColor('secondaryLabel'), lineHeight: 22 }}>
          A generic chat template built with Expo. Replace the mock responses with your own AI backend.
        </Text>
      </View>
    </ScrollView>
  );
}

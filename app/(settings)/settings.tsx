import { ScrollView, View, Text } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 20, gap: 16, maxWidth: 896, width: '100%', marginHorizontal: 'auto' }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="bg-muted rounded-xl p-4" style={{ borderCurve: 'continuous' }}>
        <Text className="text-base font-semibold text-foreground mb-2">
          Chat
        </Text>
        <Text className="text-sm text-muted-foreground leading-relaxed">
          Mock responses for demo purposes
        </Text>
      </View>

      <View className="bg-muted rounded-xl p-4" style={{ borderCurve: 'continuous' }}>
        <Text className="text-base font-semibold text-foreground mb-2">
          About
        </Text>
        <Text className="text-sm text-muted-foreground leading-relaxed">
          A generic chat template built with Expo. Replace the mock responses with your own AI backend.
        </Text>
      </View>
    </ScrollView>
  );
}

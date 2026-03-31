import { ScrollView, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="p-5 gap-4 max-w-2xl w-full mx-auto"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View
        className="bg-muted rounded-xl p-4"
        style={{ borderCurve: "continuous" }}
      >
        <Text className="text-base font-semibold text-foreground mb-2">
          Chat
        </Text>
        <Text className="text-sm text-muted-foreground leading-relaxed">
          Mock responses for demo purposes
        </Text>
      </View>

      <View
        className="bg-muted rounded-xl p-4"
        style={{ borderCurve: "continuous" }}
      >
        <Text className="text-base font-semibold text-foreground mb-2">
          About
        </Text>
        <Text className="text-sm text-muted-foreground leading-relaxed">
          A generic chat template built with Expo. Replace the mock responses
          with your own AI backend.
        </Text>
      </View>
    </ScrollView>
  );
}

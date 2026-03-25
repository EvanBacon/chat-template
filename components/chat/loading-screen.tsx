import { ActivityIndicator, Text, View } from "react-native";

export function LoadingScreen({
  status,
  error,
}: {
  status: string;
  error?: string | null;
}) {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <ActivityIndicator size="large" color="#007aff" />
      <Text className="text-lg font-semibold text-foreground">{status}</Text>
      {error && (
        <Text
          selectable
          className="text-sm text-center px-5"
          style={{ color: "#ff3b30" }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

import { platformColor } from "@/components/platform-color";
import { ActivityIndicator, Text, View } from "react-native";

export function LoadingScreen({
  status,
  error,
}: {
  status: string;
  error?: string | null;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        backgroundColor: platformColor("systemBackground"),
      }}
    >
      <ActivityIndicator size="large" color={platformColor("systemBlue")} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: platformColor("label"),
        }}
      >
        {status}
      </Text>
{error && (
        <Text
          selectable
          style={{
            color: platformColor("systemRed"),
            fontSize: 14,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

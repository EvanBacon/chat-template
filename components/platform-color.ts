import { PlatformColor as RNPlatformColor } from "react-native";

const WEB_COLORS: Record<string, string> = {
  label: "oklch(0.12 0 0)",
  secondaryLabel: "oklch(0.55 0 0)",
  tertiaryLabel: "oklch(0.7 0 0)",
  placeholderText: "oklch(0.7 0 0 / 0.5)",
  separator: "oklch(0.88 0 0)",
  link: "#007aff",
  systemBlue: "#007aff",
  systemRed: "#ff3b30",
  systemBackground: "oklch(0.985 0 0)",
  secondarySystemBackground: "oklch(0.955 0 0)",
  tertiarySystemBackground: "oklch(1 0 0)",
  tertiarySystemFill: "oklch(0.88 0 0 / 0.2)",
};

export function platformColor(name: string) {
  if (process.env.EXPO_OS === "web") {
    return WEB_COLORS[name] ?? "#000";
  }
  return RNPlatformColor(name);
}

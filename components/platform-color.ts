import { PlatformColor as RNPlatformColor } from "react-native";

/**
 * On web, maps iOS semantic color names to CSS custom properties that
 * automatically respond to light/dark mode via `prefers-color-scheme`.
 * On native, delegates to React Native's PlatformColor.
 */
const WEB_COLORS: Record<string, string> = {
  label: "var(--app-foreground)",
  secondaryLabel: "var(--app-muted-foreground)",
  tertiaryLabel: "var(--app-muted-foreground)",
  placeholderText: "var(--app-muted-foreground)",
  separator: "var(--app-border)",
  link: "#007aff",
  systemBlue: "#007aff",
  systemRed: "#ff3b30",
  systemBackground: "var(--app-background)",
  secondarySystemBackground: "var(--app-muted)",
  tertiarySystemBackground: "var(--app-card)",
  tertiarySystemFill: "var(--app-accent)",
};

export function platformColor(name: string) {
  if (process.env.EXPO_OS === "web") {
    return WEB_COLORS[name] ?? "var(--app-foreground)";
  }
  return RNPlatformColor(name);
}

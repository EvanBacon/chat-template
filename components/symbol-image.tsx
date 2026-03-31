import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, type ImageStyle } from "expo-image";
import { Platform } from "react-native";

/**
 * Map of SF Symbol names to Ionicons names for Android/web fallback.
 */
const IONICON_FALLBACKS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "arrow.up": "arrow-up",
  "chevron.down": "chevron-down",
  "bubble.left.and.bubble.right": "chatbubbles-outline",
  plus: "add",
};

type SymbolImageProps = {
  /** SF Symbol name (e.g. "arrow.up", "chevron.down") */
  name: string;
  size?: number;
  tintColor?: string;
  style?: ImageStyle;
  className?: string;
};

export function SymbolImage({
  name,
  size = 24,
  tintColor,
  style,
  className,
}: SymbolImageProps) {
  if (Platform.OS === "ios") {
    return (
      <Image
        source={`sf:${name}`}
        style={[{ width: size, height: size }, style]}
        tintColor={tintColor}
        className={className}
      />
    );
  }

  const iconName = IONICON_FALLBACKS[name] ?? "help-outline";
  return (
    <Ionicons
      name={iconName}
      size={size}
      color={tintColor}
      style={style}
    />
  );
}

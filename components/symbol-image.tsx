import ExpoIonicons from "@expo/vector-icons/Ionicons";
import { Image as ExpoImage, type ImageStyle } from "expo-image";
import { Platform } from "react-native";

import { withUniwind } from "uniwind";

const Image = withUniwind(ExpoImage);
const Ionicons = withUniwind(ExpoIonicons);

/**
 * Map of SF Symbol names to Ionicons names for Android/web fallback.
 */
const IONICON_FALLBACKS: Record<string, keyof typeof ExpoIonicons.glyphMap> = {
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
    <Ionicons name={iconName} size={size} color={tintColor} style={style} />
  );
}

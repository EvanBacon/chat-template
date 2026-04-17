import { BlurView as EXBlurView } from "expo-blur";
import {
  GlassView as XGlassView,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { Image as XImage } from "expo-image";
import { StyleSheet } from "react-native";
import { withUniwind } from "uniwind";

import { KeyboardGestureArea as XKeyboardGestureArea } from "react-native-keyboard-controller";
import Animated from "react-native-reanimated";
import { SafeAreaView as XSafeAreaView } from "react-native-safe-area-context";

export const SafeAreaView = withUniwind(XSafeAreaView);

export const Image = withUniwind(XImage);
export const KeyboardGestureArea = withUniwind(XKeyboardGestureArea);

const AnimatedEXGlassView = Animated.createAnimatedComponent(XGlassView);

const BlurView = withUniwind(EXBlurView);

export const InnerAppleGlassView = withUniwind(BetterGlassView);
const GLASS_ENABLED = isLiquidGlassAvailable();

const FallbackAppleGlassView = ({
  fallbackTint,
  fallbackIntensity,
  ...props
}: React.ComponentProps<typeof AnimatedEXGlassView> & {
  className?: string;
  fallbackTint?: React.ComponentProps<typeof EXBlurView>["tint"];
  fallbackIntensity?: React.ComponentProps<typeof EXBlurView>["intensity"];
}) => {
  return (
    <BlurView
      {...(props as any)}
      style={[{ overflow: "hidden" }, props.style]}
      tint={fallbackTint}
      intensity={fallbackIntensity}
    />
  );
};

export const AppleGlassView = GLASS_ENABLED
  ? InnerAppleGlassView
  : FallbackAppleGlassView;

function BetterGlassView(
  props: React.ComponentProps<typeof AnimatedEXGlassView>,
) {
  const { style, props: converted } = convertStylesToProps(props.style, {
    backgroundColor: "tintColor",
  });

  return <AnimatedEXGlassView {...{ ...props, style, ...converted }} />;
}

export const GlassView = withUniwind(XGlassView);

function convertStylesToProps(style: any, move: Record<string, string>) {
  if (!style) {
    return { style: style, props: {} };
  }
  const flatStyle = StyleSheet.flatten(style) || {};

  const props: Record<string, any> = {};

  for (const [styleKey, propKey] of Object.entries(move)) {
    if (styleKey in flatStyle) {
      (props as any)[propKey] = (flatStyle as any)[styleKey];
      delete flatStyle[styleKey];
    }
  }

  return { style: flatStyle, props };
}

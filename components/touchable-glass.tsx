import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import React, { useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { BlurViewRawBackdrop } from "./blur-raw";

type GlassViewProps = React.ComponentProps<typeof GlassView>;

interface TouchableGlassProps extends GlassViewProps {
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
}

function TouchableGlassNative({
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  ref,
  ...rest
}: TouchableGlassProps) {
  const tap = Gesture.Tap()
    .enabled(!disabled)
    .onBegin(() => {
      if (onPressIn) scheduleOnRN(onPressIn);
    })
    .onEnd((_e, success) => {
      if (success && onPress) scheduleOnRN(onPress);
    })
    .onFinalize(() => {
      if (onPressOut) scheduleOnRN(onPressOut);
    });

  // TODO: Add iOS 18 bounce effect on blur.
  return (
    <GestureDetector gesture={tap}>
      <GlassView
        ref={ref}
        collapsable={false}
        isInteractive={!disabled}
        {...rest}
      />
    </GestureDetector>
  );
}

function TouchableGlassFallback({
  onPress,
  onPressIn,
  onPressOut,
  ref,
  disabled,
  ...rest
}: TouchableGlassProps) {
  const [pressed, setPressed] = useState(false);
  const onTouchBegin = () => {
    setPressed(true);
    onPressIn?.();
  };
  const onTouchEnd = () => {
    setPressed(false);
    onPressOut?.();
  };
  const onTouchEndSuccess = () => {
    setPressed(false);
    onPress?.();
    onPressOut?.();
  };

  // TODO: Add iOS 18 bounce effect on blur.
  return (
    <TouchableWithoutFeedback
      className="contents"
      onPress={onTouchEndSuccess}
      onPressIn={onTouchBegin}
      onPressOut={onTouchEnd}
      disabled={disabled}
    >
      <Animated.View
        ref={ref}
        {...rest}
        style={[
          {
            overflow: "hidden",
            transitionDuration: "150ms",
            transitionProperty: ["transform", "opacity"],
            transitionTimingFunction: "ease-in-out",
          },
          pressed && { transform: [{ scale: 0.85 }] },
          disabled && { opacity: 0.5 },
          rest.style,
        ]}
      >
        <BlurViewRawBackdrop />
        {rest.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export const TouchableGlass = isLiquidGlassAvailable()
  ? TouchableGlassNative
  : TouchableGlassFallback;

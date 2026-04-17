"use client";
// import { requireNativeViewManager } from "expo-modules-core";
import React from "react";
import { StyleSheet } from "react-native";
// let _NativeBlurView: any = null;
// function getNativeBlurView() {
//   if (!_NativeBlurView) {
//     _NativeBlurView = requireNativeViewManager("ExpoBlurView");
//   }
//   return _NativeBlurView;
// }

import { NativeBlurView } from "expo-blur/build/NativeBlurModule";

export function BlurViewRawBackdrop({
  tint = "default",
  intensity = 50,
  blurReductionFactor = 4,
  experimentalBlurMethod = "none",
  style,
  children,
  ...props
}: {
  [key: string]: any;
  tint?: string;
  intensity?: number;
  blurReductionFactor?: number;
  experimentalBlurMethod?: string;
  style?: any;
  children?: any;
}) {
  // const NativeBlurView = getNativeBlurView();
  return (
    <NativeBlurView
      tint={tint}
      intensity={intensity}
      blurReductionFactor={blurReductionFactor}
      experimentalBlurMethod={experimentalBlurMethod}
      style={{
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
      }}
      {...props}
    />
  );
}

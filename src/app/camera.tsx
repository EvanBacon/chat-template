import { Icon } from "@/components/icon";
import { TouchableGlass } from "@/components/touchable-glass";
import { SafeAreaView } from "@/components/tw";
import {
  CameraView,
  type CameraCapturedPicture,
  type CameraType,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Check, RotateCcw, SwitchCamera, X, Zap, ZapOff } from "lucide-react-native";
import { useCallback, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CameraScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [capturing, setCapturing] = useState(false);
  const [preview, setPreview] = useState<CameraCapturedPicture | null>(null);

  const close = useCallback(() => router.back(), [router]);

  const flipCamera = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFacing((f) => (f === "back" ? "front" : "back"));
  }, []);

  const toggleFlash = useCallback(() => {
    Haptics.selectionAsync();
    setFlash((f) => (f === "off" ? "on" : "off"));
  }, []);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo: CameraCapturedPicture | undefined =
        await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setPreview(photo);
      }
    } finally {
      setCapturing(false);
    }
  }, [capturing]);

  const retake = useCallback(() => {
    Haptics.selectionAsync();
    setPreview(null);
  }, []);

  const usePhoto = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: hand `preview.uri` back to the composer as an attachment.
    router.back();
  }, [router]);

  // Permission still loading.
  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  // Permission not granted yet — show a clean glass prompt.
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-8">
        <Text className="text-white text-[22px] font-semibold text-center mb-2">
          Camera access
        </Text>
        <Text className="text-white/60 text-[15px] text-center mb-8">
          Allow camera access to take a photo and attach it to your chat.
        </Text>
        <TouchableGlass
          onPress={requestPermission}
          glassEffectStyle="clear"
          isInteractive
          className="rounded-full px-6 py-3"
          fallbackTint="systemUltraThinMaterialDark"
          fallbackIntensity={40}
        >
          <Text className="text-white text-[16px] font-medium">
            Enable camera
          </Text>
        </TouchableGlass>
        <Pressable onPress={close} className="mt-5 px-6 py-2 active:opacity-60">
          <Text className="text-white/60 text-[15px]">Not now</Text>
        </Pressable>
      </View>
    );
  }

  // Preview the captured photo with retake / use options.
  if (preview) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: preview.uri }}
          style={{ flex: 1 }}
          contentFit="contain"
        />

        {/* Top controls */}
        <SafeAreaView
          edges={["top"]}
          className="absolute left-0 right-0 top-0"
          pointerEvents="box-none"
        >
          <View className="px-5 pt-2" pointerEvents="box-none">
            <TouchableGlass
              onPress={close}
              isInteractive
              className="h-11 w-11 rounded-full items-center justify-center"
              fallbackTint="systemUltraThinMaterialDark"
              fallbackIntensity={40}
              aria-label="Close camera"
              role="button"
            >
              <Icon icon={X} className="w-6 h-6 text-white" />
            </TouchableGlass>
          </View>
        </SafeAreaView>

        {/* Bottom controls */}
        <SafeAreaView
          edges={["bottom"]}
          className="absolute left-0 right-0 bottom-0"
          pointerEvents="box-none"
        >
          <View
            className="flex-row items-center justify-between px-8 pb-4 pt-6"
            pointerEvents="box-none"
          >
            <TouchableGlass
              onPress={retake}
              isInteractive
              className="flex-row items-center gap-2 rounded-full px-6 py-3"
              fallbackTint="systemUltraThinMaterialDark"
              fallbackIntensity={40}
              aria-label="Retake photo"
              role="button"
            >
              <Icon icon={RotateCcw} className="w-5 h-5 text-white" />
              <Text className="text-white text-[16px] font-medium">Retake</Text>
            </TouchableGlass>

            <TouchableGlass
              onPress={usePhoto}
              glassEffectStyle="clear"
              isInteractive
              className="flex-row items-center gap-2 rounded-full px-6 py-3"
              fallbackTint="systemUltraThinMaterialDark"
              fallbackIntensity={40}
              aria-label="Use photo"
              role="button"
            >
              <Icon icon={Check} className="w-5 h-5 text-white" />
              <Text className="text-white text-[16px] font-medium">
                Use Photo
              </Text>
            </TouchableGlass>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
      />

      {/* Top controls */}
      <SafeAreaView
        edges={["top"]}
        className="absolute left-0 right-0 top-0"
        pointerEvents="box-none"
      >
        <View
          className="flex-row items-center justify-between px-5 pt-2"
          pointerEvents="box-none"
        >
          <TouchableGlass
            onPress={close}
            isInteractive
            className="h-11 w-11 rounded-full items-center justify-center"
            fallbackTint="systemUltraThinMaterialDark"
            fallbackIntensity={40}
            aria-label="Close camera"
            role="button"
          >
            <Icon icon={X} className="w-6 h-6 text-white" />
          </TouchableGlass>

          <TouchableGlass
            onPress={toggleFlash}
            isInteractive
            className="h-11 w-11 rounded-full items-center justify-center"
            fallbackTint="systemUltraThinMaterialDark"
            fallbackIntensity={40}
            aria-label={flash === "on" ? "Turn flash off" : "Turn flash on"}
            role="button"
          >
            <Icon
              icon={flash === "on" ? Zap : ZapOff}
              className="w-6 h-6 text-white"
            />
          </TouchableGlass>
        </View>
      </SafeAreaView>

      {/* Bottom controls */}
      <SafeAreaView
        edges={["bottom"]}
        className="absolute left-0 right-0 bottom-0"
        pointerEvents="box-none"
      >
        <View
          className="flex-row items-center justify-between px-10 pb-4 pt-6"
          pointerEvents="box-none"
        >
          {/* Spacer to balance the flip button */}
          <View className="h-12 w-12" />

          {/* Shutter button */}
          <Pressable
            onPress={takePicture}
            disabled={capturing}
            aria-label="Take photo"
            role="button"
            className="h-[76px] w-[76px] rounded-full items-center justify-center active:opacity-80"
          >
            <View className="h-[76px] w-[76px] rounded-full border-[3px] border-white items-center justify-center">
              <View
                className={`rounded-full bg-white ${
                  capturing ? "h-14 w-14" : "h-[62px] w-[62px]"
                }`}
              />
            </View>
          </Pressable>

          {/* Flip camera */}
          <TouchableGlass
            onPress={flipCamera}
            isInteractive
            className="h-12 w-12 rounded-full items-center justify-center"
            fallbackTint="systemUltraThinMaterialDark"
            fallbackIntensity={40}
            aria-label="Flip camera"
            role="button"
          >
            <Icon icon={SwitchCamera} className="w-6 h-6 text-white" />
          </TouchableGlass>
        </View>
      </SafeAreaView>
    </View>
  );
}

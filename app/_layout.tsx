import {
  DrawerContent,
  DrawerProvider,
  useDrawer,
} from "@/components/drawer-content";
import { DrawerLayout } from "@/components/drawer-layout";
import { useSystemBackgroundColor } from "@/utils/use-system-background-color";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import { ModelProvider } from "@/components/model-context";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { useCSSVariable } from "uniwind";

const GLASS = isLiquidGlassAvailable();
const IS_ANDROID = process.env.EXPO_OS === "android";
const MODELS = [
  {
    id: "opus-4.6",
    label: "Opus 4.6",
    subtitle: "Most capable for ambitious work",
  },
  {
    id: "sonnet-4.6",
    label: "Sonnet 4.6",
    subtitle: "Most efficient for everyday tasks",
  },
  {
    id: "haiku-4.5",
    label: "Haiku 4.5",
    subtitle: "Fastest for quick answers",
  },
] as const;

const MORE_MODELS = [
  { id: "opus-4.5", label: "Opus 4.5" },
  { id: "opus-3", label: "Opus 3" },
  { id: "sonnet-4.5", label: "Sonnet 4.5" },
] as const;

const ALL_MODELS = [...MODELS, ...MORE_MODELS];

function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <ModelProvider models={ALL_MODELS}>
          <DrawerProvider>
            <RootDrawer />
          </DrawerProvider>
        </ModelProvider>
        <StatusBar style="auto" />
      </KeyboardProvider>
    </ThemeProvider>
  );
}

function RootDrawer() {
  const router = useRouter();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  useSystemBackgroundColor();

  return (
    <DrawerLayout
      open={isOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
      drawerContent={
        <DrawerContent
          onNavigate={(path) => {
            closeDrawer();
            router.replace(path as any, { withAnchor: true });
          }}
          onOpenModal={(path) => {
            router.navigate(path as any);
          }}
        />
      }
    >
      <StackLayout />
    </DrawerLayout>
  );
}

function StackLayout() {
  const appForeground = useCSSVariable("--app-foreground") as string;

  return (
    <Stack
      screenOptions={{
        headerTransparent: GLASS || IS_ANDROID,
        headerBackButtonDisplayMode: GLASS ? "minimal" : "default",
        headerTintColor: appForeground,
      }}
    >
      <Stack.Screen
        name="index"
        dangerouslySingular
        options={{
          title: "Chat",
          animation: "none",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="chats"
        options={{
          title: "Chats",
          animation: "none",
          headerLargeTitleShadowVisible: false,
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="attachments"
        options={{
          title: "Add to chat",
          presentation: "formSheet",
          sheetAllowedDetents: [0.55],
          // following https://m3.material.io/components/bottom-sheets/specs
          sheetCornerRadius: IS_ANDROID ? 28 : undefined,
          sheetGrabberVisible: true,
          headerTransparent: GLASS,
          headerLargeTitleShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="model-picker"
        options={{
          title: "Model",
          presentation: "formSheet",
          sheetAllowedDetents: "fitToContents",
          sheetCornerRadius: IS_ANDROID ? 28 : undefined,
          sheetGrabberVisible: true,
          headerTransparent: GLASS,
          headerLargeTitleShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="(settings)"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

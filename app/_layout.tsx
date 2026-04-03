import { DrawerContent } from "@/components/drawer-content";
import { DrawerProvider, useDrawer } from "@/components/drawer-context";
import { DrawerLayout } from "@/components/drawer-layout";
import { useSystemBackgroundColor } from "@/utils/use-system-background-color";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import {
  Button,
  Host,
  HStack,
  Menu,
  Section,
  Image as SUIImage,
  Text as SUIText,
  Toggle,
  VStack,
} from "@expo/ui/swift-ui";

import {
  controlSize,
  font,
  foregroundStyle,
} from "@expo/ui/swift-ui/modifiers";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <DrawerProvider>
          <RootDrawer />
        </DrawerProvider>
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

function StackLayout() {
  const { openDrawer } = useDrawer();
  const [selectedModel, setSelectedModel] = useState("sonnet-4.6");
  const [extendedThinking, setExtendedThinking] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const headerFg = isDark ? "#fff" : "#000";
  const headerFgMuted = isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)";

  const selectedLabel =
    [...MODELS, ...MORE_MODELS].find((m) => m.id === selectedModel)?.label ??
    "Model";

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
          animation: "none",
          gestureEnabled: false,
          headerTransparent: isLiquidGlassAvailable(),
          // headerLargeTitleShadowVisible: false,
          headerBackButtonDisplayMode: isLiquidGlassAvailable()
            ? "minimal"
            : "default",

          headerTitle:
            process.env.EXPO_OS !== "ios"
              ? undefined
              : () => {
                  const selected = [...MODELS, ...MORE_MODELS].find(
                    (m) => m.id === selectedModel,
                  );
                  const subtitle = extendedThinking ? "Extended" : undefined;
                  return (
                    <Host
                      style={{
                        minWidth: 120,
                        minHeight: 40,
                      }}
                    >
                      <Menu
                        label={
                          <VStack spacing={0}>
                            <HStack spacing={4} alignment="center">
                              <SUIText
                                modifiers={[
                                  foregroundStyle(headerFg),
                                  font({ weight: "semibold", size: 17 }),
                                ]}
                              >
                                {selected?.label ?? "Model"}
                              </SUIText>
                              <SUIImage
                                systemName="chevron.down"
                                size={10}
                                color={headerFg}
                              />
                            </HStack>
                            {subtitle && (
                              <SUIText
                                modifiers={[
                                  foregroundStyle(headerFgMuted),
                                  font({ size: 12 }),
                                ]}
                              >
                                {subtitle}
                              </SUIText>
                            )}
                          </VStack>
                        }
                        modifiers={[controlSize("regular")]}
                      >
                        <Section title="Existing tools for iOS app tech stack detection">
                          <Button
                            systemImage="archivebox"
                            label="Add to project"
                            onPress={() => {}}
                          />
                          <Button
                            systemImage="star"
                            label="Star"
                            onPress={() => {}}
                          />
                          <Button
                            systemImage="pencil"
                            label="Rename"
                            onPress={() => {}}
                          />
                          <Button
                            systemImage="trash"
                            label="Delete"
                            role="destructive"
                            onPress={() => {}}
                          />
                        </Section>
                        <Toggle
                          isOn={extendedThinking}
                          onIsOnChange={setExtendedThinking}
                        >
                          <SUIText>Extended thinking</SUIText>
                          <SUIText>Think longer for complex tasks</SUIText>
                        </Toggle>
                      </Menu>
                    </Host>
                  );
                },
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon={"list.bullet"}
            tintColor={isDark ? "white" : "black"}
            onPress={openDrawer}
          />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Button
            icon={"eyeglasses"}
            tintColor={isDark ? "white" : "black"}
            onPress={() => {}}
          />
          {/* <Stack.Toolbar.Menu>
            <Stack.Toolbar.Label>{selectedLabel}</Stack.Toolbar.Label>
            <Stack.Toolbar.Menu inline>
              {MODELS.map((model) => (
                <Stack.Toolbar.MenuAction
                  key={model.id}
                  subtitle={model.subtitle}
                  isOn={selectedModel === model.id}
                  onPress={() => setSelectedModel(model.id)}
                >
                  {model.label}
                </Stack.Toolbar.MenuAction>
              ))}
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.MenuAction
              icon="brain"
              subtitle="Think longer for harder problems"
              isOn={extendedThinking}
              onPress={() => setExtendedThinking((prev) => !prev)}
            >
              Extended thinking
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.Menu title="More models">
              {MORE_MODELS.map((model) => (
                <Stack.Toolbar.MenuAction
                  key={model.id}
                  isOn={selectedModel === model.id}
                  onPress={() => setSelectedModel(model.id)}
                >
                  {model.label}
                </Stack.Toolbar.MenuAction>
              ))}
            </Stack.Toolbar.Menu>
          </Stack.Toolbar.Menu> */}
        </Stack.Toolbar>
      </Stack.Screen>

      <Stack.Screen
        name="chats"
        options={{
          title: "Chats",
          animation: "none",
          gestureEnabled: false,
        }}
      >
        <Stack.Header transparent></Stack.Header>
      </Stack.Screen>

      <Stack.Screen
        name="add-to-chat"
        options={{
          presentation: "formSheet",
          title: "Add to chat",

          sheetAllowedDetents: [0.55, 0.85],
          sheetGrabberVisible: true,
          headerTransparent: isLiquidGlassAvailable(),
          headerLargeTitleShadowVisible: false,
          contentStyle: { backgroundColor: "transparent" },
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

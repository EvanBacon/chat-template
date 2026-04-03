import { DrawerProvider, useDrawer } from "@/components/drawer-context";
import { DrawerLayout } from "@/components/drawer-layout";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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

import { TouchableGlass } from "@/components/touchable-glass";
import { Image } from "@/components/tw";
import { cn } from "@/utils/tailwind";
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
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView as XSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
const SafeAreaView = withUniwind(XSafeAreaView);

function ThemeProvider(props: { children: React.ReactNode }) {
  // TODO: Enable other modes
  // const colorScheme = useColorScheme();
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

const MOCK_CHATS = [
  { id: "1", title: "Job offer from Expo" },
  { id: "2", title: "Existing tools for iOS app tech stack" },
  { id: "3", title: "Headless iOS simulator gateway" },
  { id: "4", title: "Top three.js projects" },
  { id: "5", title: "Austin magician review" },
  { id: "6", title: "Expo agent GitHub bot description" },
  { id: "7", title: "Building an iMessage bot with Claude" },
  { id: "8", title: "Conditional HMR disabling in webpack" },
  { id: "9", title: "Reworking rejection note for directive" },
  { id: "10", title: "Optimizing parallel git config queries" },
  { id: "11", title: "React Native navigation patterns" },
  { id: "12", title: "Debugging metro bundler crashes" },
];

function DrawerNavItem({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 mx-2 rounded-[10px] active:bg-muted"
    >
      <Text className="text-base text-foreground">{label}</Text>
    </Pressable>
  );
}

function DrawerChatItem({
  title,
  onPress,
  active,
}: {
  title: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        `px-4 py-2.5 mx-2 rounded-[10px] active:bg-accent`,
        active && "bg-muted",
      )}
    >
      <Text
        numberOfLines={1}
        className={cn(
          `text-[15px]`,
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function DrawerContent({
  onNavigate,
  onOpenModal,
}: {
  onNavigate: (path: string) => void;
  onOpenModal: (path: string) => void;
}) {
  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "bottom", "left"]}
    >
      {/* Header */}
      <View className="px-4 pt-2 pb-3">
        <Text className="text-[28px] font-bold text-foreground">Chat</Text>
      </View>

      {/* Nav + Chat history */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <DrawerNavItem label="Chats" onPress={() => onNavigate("/chats")} />
        <DrawerNavItem
          label="Settings"
          onPress={() => onOpenModal("/(settings)/settings")}
        />

        {/* Recents */}
        <Text className="text-[13px] font-semibold text-muted-foreground px-6 pt-5 pb-1.5">
          Recents
        </Text>
        {MOCK_CHATS.map((chat) => (
          <DrawerChatItem
            key={chat.id}
            title={chat.title}
            active={chat.id === "1"}
            onPress={() => onNavigate("/")}
          />
        ))}
      </ScrollView>

      {/* Footer */}
      <View
        className="flex-row items-center px-4 py-3 border-t border-border"
        style={{ borderTopWidth: StyleSheet.hairlineWidth }}
      >
        <TouchableGlass
          onPress={() => onOpenModal("/(settings)/settings")}
          className="rounded-full p-2 flex-row items-center gap-2.5 active:opacity-60"
        >
          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
            <Text className="text-[13px] font-semibold text-foreground">
              EB
            </Text>
          </View>
          <Text className="text-sm text-foreground">Evan Bacon</Text>
        </TouchableGlass>
        <View className="flex-1" />
        <TouchableGlass
          onPress={() => onNavigate("/")}
          className="w-10 h-10 rounded-full bg-foreground active:bg-muted items-center justify-center"
        >
          <Image
            source="sf:plus.message"
            className="text-2xl text-background"
          />
        </TouchableGlass>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <KeyboardProvider>
      <ThemeProvider>
        <DrawerProvider>
          <RootDrawer />
        </DrawerProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </KeyboardProvider>
  );
}

function RootDrawer() {
  const router = useRouter();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

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

import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useState } from "react";

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
  const router = useRouter();
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

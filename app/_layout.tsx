import { DrawerLayout } from "@/components/drawer-layout";
import { Slot, useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

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
import { SafeAreaView } from "react-native-safe-area-context";

function ThemeProvider(props: { children: React.ReactNode }) {
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
      className={`px-4 py-2.5 mx-2 rounded-[10px] ${active ? "bg-muted" : "active:bg-accent"}`}
    >
      <Text
        numberOfLines={1}
        className={`text-[15px] ${active ? "text-foreground" : "text-muted-foreground"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-background"
      edges={["top", "bottom", "left"]}
    >
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text className="text-[28px] font-bold text-foreground">Chat</Text>
      </View>

      {/* Nav + Chat history */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <DrawerNavItem label="Chats" onPress={() => onNavigate("/")} />
        <DrawerNavItem
          label="Settings"
          onPress={() => onNavigate("/settings")}
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
        <Pressable className="flex-row items-center gap-2.5 flex-1 py-1 active:opacity-60">
          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
            <Text className="text-[13px] font-semibold text-foreground">
              EB
            </Text>
          </View>
          <Text className="text-[15px] text-foreground">Evan Bacon</Text>
        </Pressable>
        <Pressable
          onPress={() => onNavigate("/")}
          className="w-10 h-10 rounded-full bg-accent active:bg-muted items-center justify-center"
        >
          <Text
            className="text-[22px] font-light text-foreground"
            style={{ marginTop: -1 }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const params = useGlobalSearchParams<{ drawer?: string }>();
  const drawerOpen = params.drawer === "open";

  const onOpen = useCallback(
    () => router.setParams({ drawer: "open" }),
    [router],
  );
  const onClose = useCallback(
    () => router.setParams({ drawer: undefined }),
    [router],
  );

  return (
    <KeyboardProvider>
      <ThemeProvider>
        <DrawerLayout
          open={drawerOpen}
          onOpen={onOpen}
          onClose={onClose}
          drawerContent={
            <DrawerContent
              onNavigate={(path) => {
                router.replace(path as any, { withAnchor: true });
              }}
            />
          }
        >
          <Slot />
        </DrawerLayout>
      </ThemeProvider>
      <StatusBar style="auto" />
    </KeyboardProvider>
  );
}

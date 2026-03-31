import { DrawerLayout } from "@/components/drawer-layout";
import { Slot, useGlobalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import { TouchableGlass } from "@/components/touchable-glass";
import { Image } from "@/components/tw";
import { cn } from "@/utils/tailwind";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView as XSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
const SafeAreaView = withUniwind(XSafeAreaView);

function ThemeProvider(props: { children: React.ReactNode }) {
  // TODO: Enable other modes
  const colorScheme = "dark"; // useColorScheme();
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

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
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
        <TouchableGlass className="rounded-full p-2 flex-row items-center gap-2.5 active:opacity-60">
          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center">
            <Text className="text-[13px] font-semibold text-foreground">
              EB
            </Text>
          </View>
          <Text className="text-sm text-foreground">Evan Bacon</Text>
        </TouchableGlass>
        <View className="flex-1" />
        <TouchableGlass
          tintColor="#FFF"
          onPress={() => onNavigate("/")}
          className="w-10 h-10 rounded-full bg-accent active:bg-muted items-center justify-center"
        >
          <Image source="sf:plus.message" className="text-2xl text-black" />
        </TouchableGlass>
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

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
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 8,
        borderRadius: 10,
        backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
      })}
    >
      <Text style={{ fontSize: 16 }}>{label}</Text>
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
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 8,
        borderRadius: 10,
        backgroundColor: active
          ? "rgba(0,0,0,0.06)"
          : pressed
            ? "rgba(0,0,0,0.03)"
            : "transparent",
      })}
    >
      <Text
        numberOfLines={1}
        style={{ fontSize: 15, color: active ? "#000" : "rgba(0,0,0,0.7)" }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom", "left"]}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: "700" }}>Chat</Text>
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
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "rgba(0,0,0,0.4)",
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 6,
          }}
        >
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
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "rgba(0,0,0,0.1)",
        }}
      >
        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            flex: 1,
            paddingVertical: 4,
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "rgba(0,0,0,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "600" }}>EB</Text>
          </View>
          <Text style={{ fontSize: 15 }}>Evan Bacon</Text>
        </Pressable>
        <Pressable
          onPress={() => onNavigate("/")}
          style={({ pressed }) => ({
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: pressed ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Text style={{ fontSize: 22, fontWeight: "300", marginTop: -1 }}>
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

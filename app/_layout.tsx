import { DrawerLayout } from "@/components/drawer-layout";
import {
  Slot,
  usePathname,
  useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import "../utils/css-variables";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as RNTheme,
} from "@react-navigation/native";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ThemeProvider(props: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <RNTheme value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {props.children}
    </RNTheme>
  );
}

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom", "left"]}>
      <View style={{ flex: 1, paddingTop: 8 }}>
        <Pressable
          onPress={() => onNavigate("/")}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginHorizontal: 8,
            borderRadius: 10,
            backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
          })}
        >
          <Text style={{ fontSize: 16 }}>Chat</Text>
        </Pressable>
        <Pressable
          onPress={() => onNavigate("/settings")}
          style={({ pressed }) => ({
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginHorizontal: 8,
            borderRadius: 10,
            backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
          })}
        >
          <Text style={{ fontSize: 16 }}>Settings</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer when the route changes
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  const onOpen = useCallback(() => setDrawerOpen(true), []);
  const onClose = useCallback(() => setDrawerOpen(false), []);

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
                setDrawerOpen(false);
                router.push(path as any);
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

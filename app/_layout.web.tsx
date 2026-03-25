import "../global.css";
import { Sidebar, SidebarToggle } from "@/components/sidebar";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <View className="flex h-dvh w-full flex-row bg-sidebar">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Main content area */}
      <View className="flex flex-1 min-w-0 flex-col">
        {/* Mobile header with sidebar toggle */}
        <View className="flex h-14 flex-row items-center gap-2 bg-sidebar px-3 md:hidden">
          <SidebarToggle onPress={() => setSidebarOpen(true)} />
        </View>

        {/* Inset content panel */}
        <View className="flex flex-1 min-h-0 flex-col overflow-hidden bg-background md:rounded-tl-xl md:border-t md:border-l md:border-border/40">
          <Slot />
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

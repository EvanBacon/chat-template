import { Link, usePathname } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const NAV_ITEMS = [
  { href: "/", label: "Chat", icon: "+" },
  { href: "/settings", label: "Settings", icon: "S" },
] as const;

export function Sidebar({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <Pressable
          onPress={onToggle}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      {/* Sidebar panel */}
      <View
        className={`
          fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col bg-sidebar border-r border-border/40
          transition-transform duration-300
          md:relative md:z-auto md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between p-3 h-14">
          <Text className="text-sm font-semibold text-foreground tracking-tight">
            Chat
          </Text>
          <Pressable
            onPress={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent md:hidden"
          >
            <Text className="text-muted-foreground text-sm">X</Text>
          </Pressable>
        </View>

        {/* New Chat button */}
        <View className="px-3 pb-2">
          <Link href="/" asChild>
            <Pressable className="flex h-8 w-full flex-row items-center justify-center rounded-lg border border-border/50 hover:bg-accent">
              <Text className="text-xs font-medium text-foreground">
                New Chat
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Navigation */}
        <View className="flex-1 px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  className={`flex flex-row items-center gap-2 rounded-lg px-3 py-2 mb-0.5 ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isActive
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </>
  );
}

export function SidebarToggle({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent md:hidden"
    >
      <Text className="text-muted-foreground text-base">☰</Text>
    </Pressable>
  );
}

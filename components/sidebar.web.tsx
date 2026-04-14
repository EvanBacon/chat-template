import * as Tooltip from "@radix-ui/react-tooltip";
import { Link, usePathname } from "expo-router";
import {
  MessageSquarePlus,
  PanelLeft,
  PanelLeftOpen,
  SquarePen,
  Trash2,
} from "lucide-react";
import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

function SidebarTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          className="z-[100] rounded-lg bg-foreground px-3 py-1.5 text-[13px] text-background shadow-float animate-fade-up"
        >
          {label}
          <Tooltip.Arrow className="fill-foreground" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Chats" },
  { href: "/settings", label: "Settings" },
] as const;

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

/**
 * Sidebar matching the native drawer content layout:
 * - Bold "Chat" title
 * - Nav items (Chats, Settings)
 * - Scrollable "Recents" section with mock chat history
 * - Footer with user avatar + new chat button
 *
 * Collapses on desktop, slides on mobile.
 */
export function Sidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapse,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
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

      {/* Sidebar */}
      <View
        className={`
          fixed left-0 top-0 z-50 flex h-dvh flex-col bg-sidebar
          md:relative md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          width: isCollapsed ? 48 : 280,
          transition: "width 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        {!isCollapsed && (
          <View className="flex flex-row items-center px-4 pt-5 pb-3">
            <View className="flex flex-row items-center justify-between flex-1">
              <Text className="text-[28px] font-bold text-foreground">
                Chat
              </Text>
              <View className="flex flex-row items-center gap-1">
                {/* Close button on mobile */}
                <Pressable
                  onPress={onToggle}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
                >
                  <Text className="text-sm">✕</Text>
                </Pressable>
                {/* Collapse button on desktop */}
                <Pressable
                  onPress={onCollapse}
                  className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <PanelLeft size={18} strokeWidth={1.5} />
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* Nav + Chat history */}
        {!isCollapsed && (
          <ScrollView
            className="flex-1"
            // @ts-expect-error
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {/* Nav items */}
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href as any} asChild>
                  <Pressable
                    className={`px-4 py-3 mx-2 rounded-[10px] ${
                      isActive
                        ? "bg-accent"
                        : "hover:bg-accent/50 active:bg-accent"
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        isActive
                          ? "text-foreground font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}

            {/* Recents */}
            <Text className="text-[13px] font-semibold text-muted-foreground/60 px-6 pt-5 pb-1.5 uppercase tracking-wider">
              Recents
            </Text>
            {MOCK_CHATS.map((chat) => {
              const isActive = chat.id === "1";
              return (
                <Link key={chat.id} href="/" asChild>
                  <Pressable
                    className={`px-4 py-2.5 mx-2 rounded-[10px] ${
                      isActive
                        ? "bg-accent"
                        : "hover:bg-accent/50 active:bg-accent"
                    }`}
                  >
                    <Text
                      numberOfLines={1}
                      className={`text-[15px] ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {chat.title}
                    </Text>
                  </Pressable>
                </Link>
              );
            })}
          </ScrollView>
        )}

        {/* Collapsed icon rail */}
        {isCollapsed && (
          <Tooltip.Provider delayDuration={200}>
            <View className="flex flex-col items-center gap-1 pt-3 px-1.5">
              <SidebarTooltip label="Open sidebar">
                <Pressable
                  onPress={onCollapse}
                  className="sidebar-toggle-btn flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <View className="sidebar-toggle-default">
                    <PanelLeft size={18} strokeWidth={1.5} />
                  </View>
                  <View className="sidebar-toggle-hover">
                    <PanelLeftOpen size={18} strokeWidth={1.5} />
                  </View>
                </Pressable>
              </SidebarTooltip>
              <SidebarTooltip label="New chat">
                <Link href="/" asChild>
                  <Pressable className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
                    <SquarePen size={18} strokeWidth={1.5} />
                  </Pressable>
                </Link>
              </SidebarTooltip>
              <SidebarTooltip label="Delete chat">
                <Pressable className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
                  <Trash2 size={18} strokeWidth={1.5} />
                </Pressable>
              </SidebarTooltip>
            </View>
          </Tooltip.Provider>
        )}

        {/* Spacer when collapsed */}
        {isCollapsed && <View className="flex-1" />}

        {/* Footer */}
        {!isCollapsed && (
          <View className="border-t border-border/40 px-3 py-3">
            <View className="flex flex-row items-center">
              <Pressable className="flex flex-row items-center gap-2.5 rounded-full hover:opacity-70 active:opacity-60">
                <View className="rounded-full bg-muted items-center justify-center shrink-0 w-8 h-8">
                  <Text className="font-semibold text-foreground text-[13px]">
                    EB
                  </Text>
                </View>
                <Text className="text-sm text-foreground">Evan Bacon</Text>
              </Pressable>

              <View className="flex-1" />
              <Link href="/" asChild>
                <Pressable className="w-10 h-10 rounded-full bg-foreground hover:bg-foreground/90 active:bg-foreground/80 items-center justify-center flex">
                  <View className="text-background">
                    <MessageSquarePlus size={18} strokeWidth={1.5} />
                  </View>
                </Pressable>
              </Link>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

export function SidebarToggle({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      <PanelLeft size={18} strokeWidth={1.5} />
    </Pressable>
  );
}

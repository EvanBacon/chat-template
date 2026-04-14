import { Link, usePathname } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

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

function PanelLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

function PanelLeftOpenIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="m14 9 3 3-3 3" />
    </svg>
  );
}

function PlusMessageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

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
                  <PanelLeftIcon />
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
          <View className="flex flex-col items-center gap-1 pt-3 px-1.5">
            <Pressable
              onPress={onCollapse}
              className="sidebar-toggle-btn flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
              // @ts-expect-error web title attribute for tooltip
              title="Open sidebar"
            >
              <View className="sidebar-toggle-default">
                <PanelLeftIcon />
              </View>
              <View className="sidebar-toggle-hover">
                <PanelLeftOpenIcon />
              </View>
            </Pressable>
            <Link href="/" asChild>
              <Pressable
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                // @ts-expect-error
                title="New chat"
              >
                <EditIcon />
              </Pressable>
            </Link>
            <Pressable
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
              // @ts-expect-error
              title="Delete chat"
            >
              <TrashIcon />
            </Pressable>
          </View>
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
                    <PlusMessageIcon />
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
      <PanelLeftIcon />
    </Pressable>
  );
}

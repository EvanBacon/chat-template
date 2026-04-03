import { useDrawer } from "@/components/drawer-context";
import { Image } from "@/components/tw";
import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";

const MOCK_CHATS = [
  { id: "1", title: "Job offer from Expo", daysAgo: 5, starred: false },
  {
    id: "2",
    title: "Existing tools for iOS app tech stack detection",
    daysAgo: 5,
    starred: false,
  },
  {
    id: "3",
    title: "Headless iOS simulator gateway for concurrent testing",
    daysAgo: 7,
    starred: false,
  },
  { id: "4", title: "Top three.js projects", daysAgo: 7, starred: true },
  { id: "5", title: "Austin magician review", daysAgo: 7, starred: false },
  {
    id: "6",
    title: "Expo agent GitHub bot description",
    daysAgo: 14,
    starred: false,
  },
  {
    id: "7",
    title: "Building an iMessage bot with Claude",
    daysAgo: 14,
    starred: true,
  },
  {
    id: "8",
    title: "Conditional HMR disabling in web frameworks",
    daysAgo: 14,
    starred: false,
  },
  {
    id: "9",
    title: "Reworking rejection note for direct approach",
    daysAgo: 14,
    starred: false,
  },
  {
    id: "10",
    title: "Optimizing parallel git config queries",
    daysAgo: 14,
    starred: false,
  },
  {
    id: "11",
    title: "Choosing between Tailwind and StyleX",
    daysAgo: 21,
    starred: false,
  },
  {
    id: "12",
    title: "Structuring messages and timelines",
    daysAgo: 28,
    starred: false,
  },
  {
    id: "13",
    title: "SVG morphing animation between shapes",
    daysAgo: 28,
    starred: false,
  },
  {
    id: "14",
    title: "React Native navigation patterns",
    daysAgo: 30,
    starred: false,
  },
  {
    id: "15",
    title: "Debugging metro bundler crashes",
    daysAgo: 35,
    starred: false,
  },
];

type Filter = "all" | "starred";

function formatTimeAgo(daysAgo: number): string {
  if (daysAgo < 7) return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  const weeks = Math.round(daysAgo / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

type Chat = (typeof MOCK_CHATS)[number];

function ChatRow({
  item,
  onRename,
  onDelete,
  onStar,
}: {
  item: Chat;
  onRename: () => void;
  onDelete: () => void;
  onStar: () => void;
}) {
  return (
    <Link href="/" asChild>
      <Link.Trigger>
        <Pressable className="flex-row items-center px-5 py-4 active:bg-card">
          <View className="flex-1 gap-0.5 mr-3">
            <Text
              numberOfLines={1}
              className="text-[17px] text-foreground"
              selectable
            >
              {item.title}
            </Text>
            <Text className="text-[13px] text-muted-foreground">
              {formatTimeAgo(item.daysAgo)}
            </Text>
          </View>
          <Image
            source="sf:chevron.right"
            className="w-2.5 h-4 font-medium text-muted-foreground"
          />
        </Pressable>
      </Link.Trigger>

      <Link.Menu>
        <Link.MenuAction
          title={item.starred ? "Unstar" : "Star"}
          icon={item.starred ? "star.fill" : "star"}
          onPress={onStar}
        />
        <Link.MenuAction title="Rename" icon="pencil" onPress={onRename} />
        <Link.MenuAction
          title="Delete"
          icon="trash"
          destructive
          onPress={onDelete}
        />
      </Link.Menu>
    </Link>
  );
}

function EmptySearch({ query }: { query: string }) {
  return (
    <View className="flex-1 items-center justify-center pt-32 gap-2">
      <Image
        source="sf:magnifyingglass"
        className="w-10 h-10"
        tintColorClassName="tint-muted-foreground"
      />
      <Text className="text-[17px] text-muted-foreground text-center px-10">
        No results found for &ldquo;{query}&rdquo;
      </Text>
    </View>
  );
}

export default function ChatsScreen() {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState(MOCK_CHATS);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    let results = chats;
    if (filter === "starred") {
      results = results.filter((c) => c.starred);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((c) => c.title.toLowerCase().includes(q));
    }
    return results;
  }, [search, chats, filter]);

  const handleRename = useCallback((chat: Chat) => {
    Alert.prompt(
      "Rename Chat",
      undefined,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (newTitle) => {
            if (newTitle?.trim()) {
              setChats((prev) =>
                prev.map((c) =>
                  c.id === chat.id ? { ...c, title: newTitle.trim() } : c,
                ),
              );
            }
          },
        },
      ],
      "plain-text",
      chat.title,
    );
  }, []);

  const handleDelete = useCallback((chat: Chat) => {
    Alert.alert("Delete Chat", `Delete "${chat.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setChats((prev) => prev.filter((c) => c.id !== chat.id));
        },
      },
    ]);
  }, []);

  const handleStar = useCallback((chat: Chat) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, starred: !c.starred } : c)),
    );
  }, []);

  return (
    <>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        className="bg-transparent"
        renderItem={({ item }) => (
          <ChatRow
            item={item}
            onRename={() => handleRename(item)}
            onDelete={() => handleDelete(item)}
            onStar={() => handleStar(item)}
          />
        )}
        ListEmptyComponent={search ? <EmptySearch query={search} /> : null}
      />

      <Stack.Screen
        options={{
          title: "Chats",
        }}
      />
      <Stack.SearchBar
        placeholder="Search"
        onChangeText={(e) => setSearch(e.nativeEvent.text)}
        onCancelButtonPress={() => setSearch("")}
      />

      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="line.horizontal.3" onPress={openDrawer} />
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon="line.horizontal.3.decrease">
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction
              icon="bubble.left.and.bubble.right"
              isOn={filter === "all"}
              onPress={() => setFilter("all")}
            >
              All chats
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction
              icon="star"
              isOn={filter === "starred"}
              onPress={() => setFilter("starred")}
            >
              Starred
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          onPress={() => router.navigate("/")}
          separateBackground
        />
      </Stack.Toolbar>
    </>
  );
}

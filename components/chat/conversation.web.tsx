import { platformColor } from "@/components/platform-color";
import { LegendList, LegendListRef } from "@legendapp/list";
import {
    createContext,
    use,
    useCallback,
    useRef,
    useState,
    type ReactElement,
    type ReactNode,
} from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useChatContext } from "./chat-context";
import type { ChatMessage } from "./types";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimatedStyle = any;

type ConversationContextValue = {
  scrollToBottom: () => void;
  promptInputStyle: AnimatedStyle;
  onPromptInputLayout: (e: LayoutChangeEvent) => void;
  scrollButtonStyle: AnimatedStyle;
};

const ConversationCtx = createContext<ConversationContextValue | null>(null);

export function useConversationContext() {
  const ctx = use(ConversationCtx);
  if (!ctx)
    throw new Error("useConversationContext must be used within <Conversation>");
  return ctx;
}



export function Conversation({
  renderMessage,
  emptyState,
  children,
}: {
  renderMessage: (info: { item: ChatMessage }) => ReactElement;
  emptyState?: ReactElement;
  children?: ReactNode;
}) {
  const { messages } = useChatContext();
  const listRef = useRef<LegendListRef>(null);
  const insets = useSafeAreaInsets();

  const [composerOffsetHeight, setComposerOffsetHeight] = useState(68);
  const composerHeight = useSharedValue(68);
  const scrollViewHeight = useSharedValue(0);
  const totalContentHeight = useSharedValue(0);
  const currentFooterHeight = useSharedValue(0);

  const scrollY = useSharedValue(0);
  const lastContentHeight = useSharedValue(0);
  const SCROLL_THRESHOLD = 50;

  const bottomInset = useDerivedValue(() => {
    return composerHeight.value + insets.bottom;
  });

  const isAtBottom = useDerivedValue(() => {
    const maxScrollY =
      totalContentHeight.value - scrollViewHeight.value + bottomInset.value;
    if (maxScrollY <= 0) return true;
    return maxScrollY - scrollY.value <= SCROLL_THRESHOLD;
  });

  const shouldShowScrollButton = useDerivedValue(() => {
    const maxScrollY =
      totalContentHeight.value - scrollViewHeight.value + bottomInset.value;
    if (maxScrollY <= 50) return false;
    return !isAtBottom.value;
  });

  const onScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
    scrollViewHeight.value = e.nativeEvent.layout.height;
  }, []);

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      const wasAtBottom = isAtBottom.value;
      const heightIncreased = height > lastContentHeight.value;

      totalContentHeight.value = height;
      lastContentHeight.value = height;

      if (wasAtBottom && heightIncreased && listRef.current) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({
            animated: true,
            viewOffset: -bottomInset.value,
          });
        });
      }
    },
    [],
  );

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({
      animated: true,
      viewOffset: -bottomInset.value,
    });
  }, []);

  const footerSpacerStyle = useAnimatedStyle(() => {
    const scrollHeight = scrollViewHeight.value;
    if (scrollHeight <= 0) return { height: 0 };

    const messageContent =
      totalContentHeight.value - currentFooterHeight.value;
    const bottom = composerHeight.value + insets.bottom;
    const blankSpace = scrollHeight - messageContent - bottom;
    const footerHeight = Math.max(0, blankSpace);

    currentFooterHeight.value = footerHeight;
    return { height: footerHeight };
  });

  const promptInputStyle = useAnimatedStyle(() => ({
    bottom: insets.bottom,
  }));

  const scrollButtonStyle = useAnimatedStyle(() => ({
    opacity: withTiming(shouldShowScrollButton.value ? 1 : 0, {
      duration: 200,
    }),
    transform: [
      {
        scale: withTiming(shouldShowScrollButton.value ? 1 : 0.8, {
          duration: 200,
        }),
      },
    ],
    bottom: composerHeight.value + insets.bottom + 12,
  }));

  const onPromptInputLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const h = e.nativeEvent.layout.height;
      composerHeight.value = h;
      setComposerOffsetHeight(h);
    },
    [],
  );

  const contextValue: ConversationContextValue = {
    scrollToBottom,
    promptInputStyle,
    onPromptInputLayout,
    scrollButtonStyle,
  };

  return (
    <ConversationCtx value={contextValue}>
      <View
        style={{
          flex: 1,
          backgroundColor: platformColor("systemBackground"),
        }}
      >
        <View style={{ flex: 1 }}>
          <LegendList
            ref={listRef}
            data={messages}
            renderItem={renderMessage as any}
            keyExtractor={(item) => (item as ChatMessage).id}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: composerOffsetHeight + insets.bottom + 8,
            }}
            estimatedItemSize={80}
            onLayout={onScrollViewLayout}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onContentSizeChange={onContentSizeChange}
            ListEmptyComponent={emptyState}
            ListFooterComponent={<Animated.View style={footerSpacerStyle} />}
          />
        </View>

        {children}
      </View>
    </ConversationCtx>
  );
}



export function ConversationScrollButton() {
  const { scrollToBottom, scrollButtonStyle } = useConversationContext();

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[{ position: "absolute", right: 16 }, scrollButtonStyle]}
    >
      <Pressable
        onPress={scrollToBottom}
        hitSlop={8}
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: platformColor("secondarySystemBackground"),
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: platformColor("label"),
          }}
        >
          ↓
        </Text>
      </Pressable>
    </Animated.View>
  );
}



export function ConversationEmptyState({
  title = "Ready",
  description,
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <Text style={{ fontSize: 48, marginBottom: 16 }}>💬</Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: platformColor("label"),
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            color: platformColor("secondaryLabel"),
          }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

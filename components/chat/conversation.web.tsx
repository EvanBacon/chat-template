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

import { useChatContext } from "./chat-context";
import type { ChatMessage } from "./types";

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
    throw new Error(
      "useConversationContext must be used within <Conversation>"
    );
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

  const [composerHeight, setComposerHeight] = useState(68);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollViewHeight = useRef(0);
  const totalContentHeight = useRef(0);
  const scrollY = useRef(0);

  const SCROLL_THRESHOLD = 50;

  const updateIsAtBottom = useCallback(() => {
    const maxScrollY =
      totalContentHeight.current -
      scrollViewHeight.current +
      composerHeight +
      16;
    if (maxScrollY <= 0) {
      setIsAtBottom(true);
      return;
    }
    setIsAtBottom(maxScrollY - scrollY.current <= SCROLL_THRESHOLD);
  }, [composerHeight]);

  const onScrollViewLayout = useCallback(
    (e: LayoutChangeEvent) => {
      scrollViewHeight.current = e.nativeEvent.layout.height;
      updateIsAtBottom();
    },
    [updateIsAtBottom]
  );

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      scrollY.current = event.nativeEvent.contentOffset.y;
      updateIsAtBottom();
    },
    [updateIsAtBottom]
  );

  const lastContentHeight = useRef(0);
  const onContentSizeChange = useCallback(
    (_width: number, height: number) => {
      const wasAtBottom =
        totalContentHeight.current -
          scrollViewHeight.current +
          composerHeight +
          16 -
          scrollY.current <=
        SCROLL_THRESHOLD;
      const heightIncreased = height > lastContentHeight.current;

      totalContentHeight.current = height;
      lastContentHeight.current = height;
      updateIsAtBottom();

      if (wasAtBottom && heightIncreased && listRef.current) {
        requestAnimationFrame(() => {
          listRef.current?.scrollToEnd({ animated: true });
        });
      }
    },
    [composerHeight, updateIsAtBottom]
  );

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, []);

  const onPromptInputLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setComposerHeight(h);
  }, []);

  const contextValue: ConversationContextValue = {
    scrollToBottom,
    promptInputStyle: { bottom: 0 },
    onPromptInputLayout,
    scrollButtonStyle: {},
  };

  return (
    <ConversationCtx value={contextValue}>
      <View className="flex-1 bg-background relative">
        {/* Message list */}
        <View className="flex-1">
          <LegendList
            ref={listRef}
            data={messages}
            renderItem={renderMessage as any}
            keyExtractor={(item) => (item as ChatMessage).id}
            contentContainerStyle={{
              paddingBottom: composerHeight + 16,
              maxWidth: 896,
              width: "100%",
              marginHorizontal: "auto",
              paddingHorizontal: 16,
              paddingTop: 24,
            }}
            estimatedItemSize={80}
            onLayout={onScrollViewLayout}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onContentSizeChange={onContentSizeChange}
            ListEmptyComponent={emptyState}
          />
        </View>

        {children}
      </View>
    </ConversationCtx>
  );
}

export function ConversationScrollButton() {
  const { scrollToBottom } = useConversationContext();
  // The button is rendered here; visibility is controlled via CSS/state in a simplified way.
  // For full implementation, this would track isAtBottom from context.

  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10"
    >
      <Pressable
        onPress={scrollToBottom}
        className="flex h-7 items-center rounded-full border border-border/50 bg-card/90 px-3 shadow-float backdrop-blur-lg"
      >
        <Text className="text-[10px] text-muted-foreground">↓</Text>
      </Pressable>
    </View>
  );
}

export function ConversationEmptyState({
  title = "How can I help you today?",
  description,
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center pt-32">
      <Text className="text-2xl font-medium text-foreground mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      )}
    </View>
  );
}

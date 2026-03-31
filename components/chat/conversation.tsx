import { SymbolImage } from "@/components/symbol-image";
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
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardGestureArea } from "../tw";
import { useChatContext } from "./chat-context";
import type { ChatMessage } from "./types";

const AnimatedLegendList = Animated.createAnimatedComponent(LegendList);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Reanimated animated styles are opaque worklet objects
type AnimatedStyle = any;

type ConversationContextValue = {
  scrollToBottom: () => void;
  /** Animated style that positions the prompt input above the keyboard. */
  promptInputStyle: AnimatedStyle;
  /** Prompt input reports its measured height through this callback. */
  onPromptInputLayout: (e: LayoutChangeEvent) => void;
  /** Animated style for the scroll-to-bottom button. */
  scrollButtonStyle: AnimatedStyle;
};

const ConversationCtx = createContext<ConversationContextValue | null>(null);

export function useConversationContext() {
  const ctx = use(ConversationCtx);
  if (!ctx)
    throw new Error(
      "useConversationContext must be used within <Conversation>",
    );
  return ctx;
}

export function Conversation({
  renderMessage,
  emptyState,
  children,
}: {
  /** Render callback for each message – passed to the underlying list. */
  renderMessage: (info: { item: ChatMessage }) => ReactElement;
  /** Element shown when the message list is empty. */
  emptyState?: ReactElement;
  /** Compound children: <ConversationScrollButton />, <PromptInput />, etc. */
  children?: ReactNode;
}) {
  const { messages } = useChatContext();
  const listRef = useRef<LegendListRef>(null);
  const insets = useSafeAreaInsets();

  // -- Keyboard tracking --------------------------------------------------

  const keyboardHeight = useSharedValue(0);
  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";
        keyboardHeight.value = e.height;
      },
      onInteractive: (e) => {
        "worklet";
        keyboardHeight.value = e.height;
      },
      onEnd: (e) => {
        "worklet";
        keyboardHeight.value = e.height;
      },
    },
    [],
  );

  // -- Layout bookkeeping --------------------------------------------------

  const [composerOffsetHeight, setComposerOffsetHeight] = useState(68);
  const composerHeight = useSharedValue(68);
  const scrollViewHeight = useSharedValue(0);
  const totalContentHeight = useSharedValue(0);
  const currentFooterHeight = useSharedValue(0);

  // -- Auto-scroll ---------------------------------------------------------

  const scrollY = useSharedValue(0);
  const lastContentHeight = useSharedValue(0);
  const SCROLL_THRESHOLD = 50;

  const bottomInset = useDerivedValue(() => {
    const keyboard = Math.abs(keyboardHeight.value);
    return composerHeight.value + Math.max(insets.bottom, keyboard);
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

  // -- Callbacks -----------------------------------------------------------

  const onScrollViewLayout = useCallback((e: LayoutChangeEvent) => {
    scrollViewHeight.value = e.nativeEvent.layout.height;
  }, []);

  const onScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const onContentSizeChange = useCallback((_width: number, height: number) => {
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
  }, []);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToEnd({
      animated: true,
      viewOffset: -bottomInset.value,
    });
  }, []);

  // -- Animated styles -----------------------------------------------------

  const footerSpacerStyle = useAnimatedStyle(() => {
    const scrollHeight = scrollViewHeight.value;
    if (scrollHeight <= 0) return { height: 0 };

    const messageContent = totalContentHeight.value - currentFooterHeight.value;
    const keyboard = Math.abs(keyboardHeight.value);
    const bottom = composerHeight.value + Math.max(insets.bottom, keyboard);
    const blankSpace = scrollHeight - messageContent - bottom;
    const footerHeight = Math.max(0, blankSpace);

    currentFooterHeight.value = footerHeight;
    return { height: footerHeight };
  });

  const promptInputStyle = useAnimatedStyle(() => ({
    bottom: Math.max(insets.bottom, Math.abs(keyboardHeight.value)),
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
    bottom:
      composerHeight.value +
      Math.max(insets.bottom, Math.abs(keyboardHeight.value)) +
      12,
  }));

  const listAnimatedProps = useAnimatedProps(() => {
    const keyboard = Math.abs(keyboardHeight.value);
    const bottom = composerHeight.value + Math.max(insets.bottom, keyboard);
    return {
      contentInset: { top: 0, left: 0, right: 0, bottom },
      scrollIndicatorInsets: { top: 0, left: 0, right: 0, bottom },
    };
  });

  const onPromptInputLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    composerHeight.value = h;
    setComposerOffsetHeight(h);
  }, []);

  // -- Context value -------------------------------------------------------

  const contextValue: ConversationContextValue = {
    scrollToBottom,
    promptInputStyle,
    onPromptInputLayout,
    scrollButtonStyle,
  };

  // -- Render --------------------------------------------------------------

  return (
    <ConversationCtx value={contextValue}>
      <View className="flex-1 bg-background">
        <KeyboardGestureArea
          interpolator="ios"
          showOnSwipeUp
          offset={composerOffsetHeight}
          className="flex-1"
        >
          <AnimatedLegendList
            ref={listRef}
            data={messages}
            renderItem={renderMessage as any}
            keyExtractor={(item) => (item as ChatMessage).id}
            contentContainerStyle={{
              padding: 16,
              // transparent header spacing.
              paddingTop: 128,
              paddingBottom: 8,
            }}
            keyboardDismissMode="interactive"
            automaticallyAdjustsScrollIndicatorInsets={false}
            maintainVisibleContentPosition
            estimatedItemSize={80}
            animatedProps={listAnimatedProps}
            onLayout={onScrollViewLayout}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onContentSizeChange={onContentSizeChange}
            ListEmptyComponent={emptyState}
            ListFooterComponent={<Animated.View style={footerSpacerStyle} />}
          />
        </KeyboardGestureArea>

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
        className="w-10 h-10 rounded-full bg-card justify-center items-center"
        style={({ pressed }) => ({
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <SymbolImage name="chevron.down" size={16} className="tint-sf-text" />
      </Pressable>
    </Animated.View>
  );
}

export function ConversationEmptyState({
  title = "Ready",
  description,
  icon = "bubble.left.and.bubble.right",
}: {
  title?: string;
  description?: string;
  icon?: string;
}) {
  return (
    <View className="flex-1 justify-center items-center pt-24">
      <SymbolImage
        name={icon}
        size={48}
        className="text-muted-foreground mb-4"
      />
      <Text className="text-xl font-semibold text-foreground mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-muted-foreground">{description}</Text>
      )}
    </View>
  );
}

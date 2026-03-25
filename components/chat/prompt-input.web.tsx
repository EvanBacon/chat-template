import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useChatContext } from "./chat-context";
import { useConversationContext } from "./conversation";

/**
 * Root container for the message composer. Card-style design matching Vercel
 * chatbot aesthetics — centered max-w-4xl with rounded border and shadow.
 */
export function PromptInput({ children }: { children: ReactNode }) {
  const { onPromptInputLayout } = useConversationContext();

  return (
    <View
      onLayout={onPromptInputLayout}
      className="absolute bottom-0 left-0 right-0 z-10"
    >
      <View className="mx-auto w-full max-w-4xl px-4 pb-4">
        <View className="rounded-2xl border border-border/30 bg-card shadow-composer transition-shadow focus-within:shadow-composer-focus">
          {children}
        </View>
      </View>
    </View>
  );
}

/**
 * A button for actions (e.g. attachments) placed in the composer footer.
 */
export function PromptInputAction({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 hover:bg-accent"
    >
      {children}
    </Pressable>
  );
}

/**
 * Container for the textarea and submit button. On web, this is the main
 * content area of the card with a footer row below.
 */
export function PromptInputBody({ children }: { children: ReactNode }) {
  return <View className="flex flex-col">{children}</View>;
}

/**
 * Auto-growing text input for composing messages.
 */
export function PromptInputTextarea({
  placeholder = "Message...",
  maxLength = 1000,
}: {
  placeholder?: string;
  maxLength?: number;
}) {
  const { input, setInput, onSend } = useChatContext();

  return (
    <TextInput
      nativeID="composer"
      className="w-full bg-transparent px-4 pt-3.5 pb-2 text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/50 outline-none"
      style={{ maxHeight: 200 }}
      value={input}
      onChangeText={setInput}
      placeholder={placeholder}
      placeholderTextColor="oklch(0.55 0 0 / 0.5)"
      multiline
      maxLength={maxLength}
      onKeyPress={(e) => {
        if (
          (e as any).nativeEvent.key === "Enter" &&
          !(e as any).nativeEvent.shiftKey
        ) {
          e.preventDefault();
          onSend();
        }
      }}
    />
  );
}

/**
 * Submit button — dark rounded button when active, muted when disabled.
 */
export function PromptInputSubmit() {
  const { input, isGenerating, onSend } = useChatContext();
  const disabled = !input.trim() || isGenerating;

  return (
    <View className="flex flex-row items-center justify-end px-3 py-2">
      <Pressable
        onPress={onSend}
        disabled={disabled}
        className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
          disabled
            ? "bg-muted cursor-not-allowed"
            : "bg-foreground hover:bg-foreground/90"
        }`}
      >
        {isGenerating ? (
          <ActivityIndicator
            size="small"
            color={disabled ? "oklch(0.55 0 0)" : "oklch(0.985 0 0)"}
          />
        ) : (
          <Text
            className={`text-xs font-bold ${
              disabled ? "text-muted-foreground/40" : "text-background"
            }`}
          >
            ↑
          </Text>
        )}
      </Pressable>
    </View>
  );
}

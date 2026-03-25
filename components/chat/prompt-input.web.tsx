import { platformColor } from "@/components/platform-color";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import { useChatContext } from "./chat-context";
import { useConversationContext } from "./conversation";

export function PromptInput({ children }: { children: ReactNode }) {
  const { promptInputStyle, onPromptInputLayout } = useConversationContext();

  return (
    <Animated.View
      onLayout={onPromptInputLayout}
      style={[{ position: "absolute", left: 0, right: 0 }, promptInputStyle]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 12,
          gap: 10,
          alignItems: "flex-end",
          backgroundColor: platformColor("systemBackground"),
          borderTopWidth: 1,
          borderTopColor: platformColor("separator"),
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function PromptInputAction({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: platformColor("tertiarySystemFill"),
      }}
      hitSlop={4}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

export function PromptInputBody({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        borderRadius: 22,
        backgroundColor: platformColor("tertiarySystemFill"),
      }}
    >
      {children}
    </View>
  );
}

export function PromptInputTextarea({
  placeholder = "Message...",
  maxLength = 1000,
}: {
  placeholder?: string;
  maxLength?: number;
}) {
  const { input, setInput } = useChatContext();

  return (
    <TextInput
      nativeID="composer"
      style={{
        flex: 1,
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
        color: platformColor("label"),
      }}
      value={input}
      onChangeText={setInput}
      placeholder={placeholder}
      placeholderTextColor={platformColor("placeholderText")}
      multiline
      maxLength={maxLength}
    />
  );
}

export function PromptInputSubmit() {
  const { input, isGenerating, onSend } = useChatContext();
  const disabled = !input.trim() || isGenerating;

  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: disabled
          ? platformColor("tertiarySystemFill")
          : platformColor("systemBlue"),
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
        margin: 5,
      })}
      onPress={onSend}
      disabled={disabled}
    >
      {isGenerating ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          ↑
        </Text>
      )}
    </Pressable>
  );
}

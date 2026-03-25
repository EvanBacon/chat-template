import { platformColor } from "@/components/platform-color";
import { TouchableGlass } from "@/components/touchable-glass";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import Animated from "react-native-reanimated";

import { useChatContext } from "./chat-context";
import { useConversationContext } from "./conversation";

const AnimatedGlassContainer = Animated.createAnimatedComponent(GlassContainer);



/**
 * Root container for the message composer. Positions itself at the bottom of
 * the `<Conversation />` using the shared conversation context. Children are
 * laid out in a horizontal row inside a glass container.
 */
export function PromptInput({ children }: { children: ReactNode }) {
  const { promptInputStyle, onPromptInputLayout } = useConversationContext();

  return (
    <Animated.View
      onLayout={onPromptInputLayout}
      style={[
        { position: "absolute", left: 0, right: 0 },
        promptInputStyle,
      ]}
    >
      <AnimatedGlassContainer
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 12,
          gap: 10,
          alignItems: "flex-end",
        }}
        spacing={8}
      >
        {children}
      </AnimatedGlassContainer>
    </Animated.View>
  );
}



/**
 * A circular glass button for actions (e.g. attachments, camera).
 */
export function PromptInputAction({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableGlass
      glassEffectStyle="regular"
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
      }}
      hitSlop={4}
      onPress={onPress}
    >
      {children}
    </TouchableGlass>
  );
}



/**
 * Glass-wrapped container for the textarea and submit button.
 */
export function PromptInputBody({ children }: { children: ReactNode }) {
  return (
    <GlassView
      isInteractive
      glassEffectStyle="regular"
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        borderRadius: 22,
        borderCurve: "continuous",
      }}
    >
      {children}
    </GlassView>
  );
}



/**
 * Auto-growing text input for composing messages. Reads/writes the current
 * input value from `ChatContext`.
 */
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



/**
 * Submit button that sends the current input. Shows a spinner while the model
 * is generating. Reads state from `ChatContext`.
 */
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
        borderCurve: "continuous",
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
        <SymbolView
          name="arrow.up"
          size={16}
          tintColor="#fff"
          weight="semibold"
        />
      )}
    </Pressable>
  );
}

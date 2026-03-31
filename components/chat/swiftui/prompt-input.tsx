import {
  Button,
  HStack,
  Menu,
  TextField,
  type TextFieldRef,
} from "@expo/ui/swift-ui";
import {
  buttonStyle,
  controlSize,
  foregroundStyle,
  frame,
  glassEffect,
  labelStyle,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useRef } from "react";

import { useChatContext } from "../chat-context";

const TextFieldRefContext = createContext<React.RefObject<TextFieldRef | null> | null>(null);

export function PromptInput({ children }: { children: ReactNode }) {
  return (
    <HStack
      spacing={8}
      alignment="bottom"
      modifiers={[padding({ horizontal: 8, bottom: 8 })]}
    >
      {children}
    </HStack>
  );
}

export function PromptInputAction() {
  return (
    <Menu
      label=""
      systemImage="plus"
      modifiers={[
        labelStyle("iconOnly"),
        foregroundStyle({ type: "hierarchical", style: "secondary" }),
        buttonStyle("glass"),
        controlSize("regular"),
      ]}
    >
      <Button systemImage="photo" label="Photos" onPress={() => {}} />
      <Button systemImage="camera" label="Camera" onPress={() => {}} />
      <Button systemImage="doc" label="File" onPress={() => {}} />
    </Menu>
  );
}

export function PromptInputBody({ children }: { children: ReactNode }) {
  const textFieldRef = useRef<TextFieldRef>(null);
  return (
    <TextFieldRefContext value={textFieldRef}>
      <HStack
        spacing={4}
        alignment="center"
        modifiers={[
          padding({ leading: 12, trailing: 4, vertical: 4 }),
          glassEffect({
            glass: { variant: "regular", interactive: true },
            shape: "capsule",
          }),
        ]}
      >
        {children}
      </HStack>
    </TextFieldRefContext>
  );
}

export function PromptInputTextarea({
  placeholder = "Message...",
}: {
  placeholder?: string;
}) {
  const { input, setInput, onSend } = useChatContext();
  const sharedRef = useContext(TextFieldRefContext);
  const localRef = useRef<TextFieldRef>(null);
  const ref = sharedRef ?? localRef;

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return;
    onSend();
    ref.current?.setText("");
  }, [input, onSend, ref]);

  return (
    <TextField
      ref={ref}
      placeholder={placeholder}
      defaultValue=""
      multiline
      numberOfLines={5}
      onChangeText={setInput}
      onSubmit={handleSubmit}
      modifiers={[frame({ minHeight: 28 })]}
    />
  );
}

export function PromptInputSubmit() {
  const { input, isGenerating, onSend } = useChatContext();
  const sharedRef = useContext(TextFieldRefContext);
  const disabled = !input.trim() || isGenerating;

  const handlePress = useCallback(() => {
    if (disabled) return;
    onSend();
    sharedRef?.current?.setText("");
  }, [disabled, onSend, sharedRef]);

  return (
    <Button
      systemImage="arrow.up"
      label="Send"
      onPress={handlePress}
      modifiers={[
        labelStyle("iconOnly"),
        buttonStyle("borderedProminent"),
        controlSize("small"),
      ]}
    />
  );
}

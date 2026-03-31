import {
  GlassEffectContainer,
  Host,
  ScrollView,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  defaultScrollAnchor,
  font,
  foregroundStyle,
  padding,
  scrollDismissesKeyboard,
} from "@expo/ui/swift-ui/modifiers";
import type { ReactElement, ReactNode } from "react";

import { useChatContext } from "../chat-context";
import type { ChatMessage } from "../types";

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

  return (
    <Host style={{ flex: 1 }}>
      <GlassEffectContainer spacing={8}>
        <VStack spacing={0}>
          <ScrollView
            axes="vertical"
            modifiers={[
              scrollDismissesKeyboard("interactively"),
              defaultScrollAnchor(messages.length === 0 ? "center" : "top"),
            ]}
          >
            <VStack
              alignment="leading"
              spacing={8}
              modifiers={[padding({ top: 16, horizontal: 16, bottom: 16 })]}
            >
              {messages.length === 0 && emptyState}
              {messages.map((msg) => renderMessage({ item: msg }))}
            </VStack>
          </ScrollView>
          {children}
        </VStack>
      </GlassEffectContainer>
    </Host>
  );
}

export function ConversationEmptyState({
  title = "Ready",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <VStack alignment="center" spacing={8}>
      <Text
        modifiers={[
          foregroundStyle({ type: "hierarchical", style: "primary" }),
          font({ size: 20, weight: "semibold" }),
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          modifiers={[
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
          ]}
        >
          {description}
        </Text>
      )}
    </VStack>
  );
}

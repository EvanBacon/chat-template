import { ChatMarkdown } from "@/components/markdown";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

/**
 * Web-specific message component with Vercel chatbot-style design.
 * User messages: right-aligned gradient bubbles with card shadow.
 * Assistant messages: left-aligned flowing content with sparkles icon.
 */
export function Message({
  from,
  children,
}: {
  from: "user" | "assistant";
  children: ReactNode;
}) {
  if (from === "user") {
    return (
      <View className="flex flex-row justify-end mb-3 animate-fade-up">
        <View className="max-w-[min(80%,56ch)] rounded-2xl rounded-br-lg bg-gradient-to-b from-secondary to-muted border border-border/30 px-4 py-3 shadow-card">
          {typeof children === "string" ? (
            <Text
              selectable
              className="text-[13px] leading-[1.65] text-foreground"
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-row gap-3 mb-3">
      <View className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/60 border border-border/50">
        <Text className="text-xs text-muted-foreground">AI</Text>
      </View>
      <View className="flex-1 min-w-0">{children}</View>
    </View>
  );
}

/**
 * Renders markdown content for an assistant message.
 */
export function MessageResponse({ children }: { children: string }) {
  return <ChatMarkdown>{children || "..."}</ChatMarkdown>;
}

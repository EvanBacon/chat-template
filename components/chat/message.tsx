import { ChatMarkdown } from "@/components/markdown";
import { platformColor } from "@/components/platform-color";
import type { ReactNode } from "react";
import { Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";



/**
 * Wrapper for a single chat message. Styles automatically based on the sender
 * role – user messages render as right-aligned blue bubbles, assistant messages
 * render full-width.
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
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{
          maxWidth: "80%",
          padding: 12,
          borderRadius: 18,
          borderCurve: "continuous",
          marginBottom: 8,
          alignSelf: "flex-end",
          backgroundColor: platformColor("systemBlue"),
        }}
      >
        {typeof children === "string" ? (
          <Text
            selectable
            style={{ fontSize: 16, lineHeight: 22, color: "#fff" }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      style={{ marginBottom: 8 }}
    >
      {children}
    </Animated.View>
  );
}



/**
 * Renders markdown content for an assistant message. Wraps `<ChatMarkdown />`
 * with appropriate defaults.
 */
export function MessageResponse({ children }: { children: string }) {
  return <ChatMarkdown>{children || "..."}</ChatMarkdown>;
}

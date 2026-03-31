import { Text, VStack } from "@expo/ui/swift-ui";
import {
  background,
  cornerRadius,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import type { ReactNode } from "react";

export function Message({
  from,
  children,
}: {
  from: "user" | "assistant";
  children: ReactNode;
}) {
  if (from === "user") {
    return (
      <VStack
        alignment="trailing"
        modifiers={[frame({ alignment: "trailing", maxWidth: Infinity })]}
      >
        <VStack
          alignment="trailing"
          modifiers={[
            padding({ all: 12 }),
            background("#2C2C2E"),
            cornerRadius(16),
            frame({ alignment: "trailing", maxWidth: 280 }),
          ]}
        >
          {typeof children === "string" ? (
            <Text modifiers={[foregroundStyle("#FFFFFF")]}>{children}</Text>
          ) : (
            children
          )}
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack alignment="leading" spacing={4}>
      {children}
    </VStack>
  );
}

export function MessageResponse({ children }: { children: string }) {
  return (
    <Text
      markdownEnabled
      modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
    >
      {children || "..."}
    </Text>
  );
}

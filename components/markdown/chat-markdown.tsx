import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { Markdown } from "./index";

const VAR_NAMES = [
  "--app-foreground",
  "--app-foreground-muted",
  "--app-border",
  "--app-bg-2",
  "--app-bg-3",
  "--app-fill-3",
  // Tailwind blue
  "--color-blue-400",
] as const;

/**
 * Convert single newlines to hard breaks (two trailing spaces) so they render
 * the same way they appear during streaming. Skips fenced code blocks.
 */
function preserveNewlines(md: string): string {
  return md.replace(/(```[\s\S]*?```)|(\n)/g, (match, codeBlock) =>
    codeBlock ? match : "  \n",
  );
}

export function ChatMarkdown({ children }: { children: string }) {
  const [text, text2, border, bg2, bg3, fill3, link] = useCSSVariable(
    VAR_NAMES as unknown as string[],
  ) as string[];

  const isWeb = process.env.EXPO_OS === "web";
  const baseFontSize = isWeb ? 13 : 16;
  const baseLineHeight = isWeb ? 21.5 : 22;

  const markdownStyles = {
    root: {},
    heading1: {
      fontSize: 24,
      fontWeight: "bold" as const,
      color: text,
    },
    heading2: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: "bold" as const,
      color: text,
    },
    heading3: {
      fontSize: 18,
      fontWeight: "600" as const,
      color: text,
    },
    heading4: {
      fontSize: 16,
      fontWeight: "600" as const,
      color: text,
    },
    heading5: {
      fontSize: 14,
      fontWeight: "600" as const,
      color: text,
    },
    heading6: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: text,
    },
    paragraph: {
      fontSize: baseFontSize,
      marginVertical: 4,
      flexWrap: "wrap" as const,
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      justifyContent: "flex-start" as const,
      width: "100%" as const,
    },
    strong: {
      fontWeight: "bold" as const,
    },
    emphasis: {
      fontStyle: "italic" as const,
    },
    text: {
      color: text,
      fontSize: baseFontSize,
      lineHeight: baseLineHeight,
    },
    thematicBreak: {
      flex: 1,
      height: 1,
      backgroundColor: border,
      marginVertical: 8,
    },
    blockquote: {
      backgroundColor: bg3,
      borderColor: border,
      borderLeftWidth: 4,
      paddingHorizontal: 8,
      marginVertical: 8,
    },
    codeContainer: {
      backgroundColor: fill3,
      padding: 12,
      borderRadius: 8,
      marginVertical: 4,
    },
    codeText: {
      fontSize: isWeb ? 12 : 14,
      color: text,
      fontFamily: Platform.select({
        ios: "ui-monospace",
        default: "monospace",
      }),
    },
    inlineCode: {
      fontFamily: Platform.select({
        ios: "ui-monospace",
        default: "monospace",
      }),
      paddingHorizontal: 4,
      fontSize: isWeb ? 12 : 15,
      color: text,
      overflow: "hidden" as const,
      borderRadius: 4,
      backgroundColor: fill3,
    },
    link: {
      fontSize: baseFontSize,
      color: link,
    },
    image: {
      width: "100%" as const,
      height: 200,
      aspectRatio: 16 / 9,
      resizeMode: "cover" as const,
      backgroundColor: fill3,
      borderRadius: 8,
      overflow: "hidden" as const,
    },
    list: {},
    listItem: {
      flexDirection: "row" as const,
      alignItems: "baseline" as const,
      justifyContent: "flex-start" as const,
    },
    listBullet: {
      fontSize: 16,
      color: text2,
      fontVariant: ["tabular-nums" as const],
      marginRight: 8,
    },
    listItemContent: {
      flex: 1,
      flexWrap: "wrap" as const,
    },
    delete: {
      textDecorationLine: "line-through" as const,
    },
    // Table styles
    table: {
      marginVertical: 8,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 8,
      overflow: "hidden" as const,
    },
    tableRow: {
      flexDirection: "row" as const,
      borderBottomWidth: 1,
      borderBottomColor: border,
    },
    tableHeaderRow: {
      backgroundColor: bg2,
    },
    tableCell: {
      flex: 1,
      padding: 10,
      borderRightWidth: 1,
      borderRightColor: border,
    },
    tableHeaderCell: {
      backgroundColor: bg2,
    },
    tableCellText: {
      fontSize: 14,
      color: text,
    },
    tableHeaderCellText: {
      fontWeight: "600" as const,
      color: text,
    },
  };

  return (
    <Markdown
      styles={markdownStyles}
      onLinkPress={(url) => {
        if (process.env.EXPO_OS === "web") {
          Linking.openURL(url);
        } else {
          WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
      renderRules={{
        listItem: ({ node, styles, children, extras }) => (
          <View key={node.key} style={styles.listItem as any}>
            {extras?.customListStyleType ? (
              extras.customListStyleType
            ) : (
              <Text
                style={[
                  styles.listBullet as any,
                  extras?.ordered
                    ? fullStyles.orderedBullet
                    : fullStyles.unorderedBullet,
                ]}
              >
                {extras?.listStyleType}
              </Text>
            )}
            <View style={styles.listItemContent as any}>{children}</View>
          </View>
        ),
      }}
      markdown={preserveNewlines(children)}
    />
  );
}

const fullStyles = StyleSheet.create({
  orderedBullet: {
    fontFamily: Platform.select({ ios: "ui-monospace", default: "monospace" }),
    fontWeight: "normal",
  },
  unorderedBullet: {
    fontSize: 18,
    fontWeight: "900",
  },
});

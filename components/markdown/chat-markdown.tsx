import React, { memo } from 'react';
import { platformColor } from "@/components/platform-color";
import { StyleSheet, Text, View, Platform, Linking } from 'react-native';
import { Markdown } from './index';
import * as WebBrowser from 'expo-web-browser';

export const ChatMarkdown = memo(
  function ChatMarkdown({ children }: { children: string }) {
    const isWeb = process.env.EXPO_OS === 'web';
    const baseFontSize = isWeb ? 13 : 16;
    const baseLineHeight = isWeb ? 21.5 : 22;

    const markdownStyles = {
      root: {},
      heading1: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: platformColor('label'),
      },
      heading2: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: 'bold' as const,
        color: platformColor('label'),
      },
      heading3: {
        fontSize: 18,
        fontWeight: '600' as const,
        color: platformColor('label'),
      },
      heading4: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: platformColor('label'),
      },
      heading5: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: platformColor('label'),
      },
      heading6: {
        fontSize: 12,
        fontWeight: '600' as const,
        color: platformColor('label'),
      },
      paragraph: {
        fontSize: baseFontSize,
        marginVertical: 4,
        flexWrap: 'wrap' as const,
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        justifyContent: 'flex-start' as const,
        width: '100%' as const,
      },
      strong: {
        fontWeight: 'bold' as const,
      },
      emphasis: {
        fontStyle: 'italic' as const,
      },
      text: {
        color: platformColor('label'),
        fontSize: baseFontSize,
        lineHeight: baseLineHeight,
      },
      thematicBreak: {
        flex: 1,
        height: 1,
        backgroundColor: platformColor('separator'),
        marginVertical: 8,
      },
      blockquote: {
        backgroundColor: platformColor('tertiarySystemBackground'),
        borderColor: platformColor('separator'),
        borderLeftWidth: 4,
        paddingHorizontal: 8,
        marginVertical: 8,
      },
      codeContainer: {
        backgroundColor: platformColor('tertiarySystemFill'),
        padding: 12,
        borderRadius: 8,
        marginVertical: 4,
      },
      codeText: {
        fontSize: isWeb ? 12 : 14,
        color: platformColor('label'),
        fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
      },
      inlineCode: {
        fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
        paddingHorizontal: 4,
        fontSize: isWeb ? 12 : 15,
        color: platformColor('label'),
        overflow: 'hidden' as const,
        borderRadius: 4,
        backgroundColor: platformColor('tertiarySystemFill'),
      },
      link: {
        fontSize: baseFontSize,
        color: platformColor('link'),
      },
      image: {
        width: '100%' as const,
        height: 200,
        aspectRatio: 16 / 9,
        resizeMode: 'cover' as const,
        backgroundColor: platformColor('tertiarySystemFill'),
        borderRadius: 8,
        overflow: 'hidden' as const,
      },
      list: {},
      listItem: {
        flexDirection: 'row' as const,
        alignItems: 'baseline' as const,
        justifyContent: 'flex-start' as const,
      },
      listBullet: {
        fontSize: 16,
        color: platformColor('secondaryLabel'),
        fontVariant: ['tabular-nums' as const],
        marginRight: 8,
      },
      listItemContent: {
        flex: 1,
        flexWrap: 'wrap' as const,
      },
      delete: {
        textDecorationLine: 'line-through' as const,
      },
      // Table styles
      table: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: platformColor('separator'),
        borderRadius: 8,
        overflow: 'hidden' as const,
      },
      tableRow: {
        flexDirection: 'row' as const,
        borderBottomWidth: 1,
        borderBottomColor: platformColor('separator'),
      },
      tableHeaderRow: {
        backgroundColor: platformColor('secondarySystemBackground'),
      },
      tableCell: {
        flex: 1,
        padding: 10,
        borderRightWidth: 1,
        borderRightColor: platformColor('separator'),
      },
      tableHeaderCell: {
        backgroundColor: platformColor('secondarySystemBackground'),
      },
      tableCellText: {
        fontSize: 14,
        color: platformColor('label'),
      },
      tableHeaderCellText: {
        fontWeight: '600' as const,
        color: platformColor('label'),
      },
    };

    return (
      <Markdown
        styles={markdownStyles}
        onLinkPress={(url) => {
          if (process.env.EXPO_OS === 'web') {
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
                    extras?.ordered ? fullStyles.orderedBullet : fullStyles.unorderedBullet,
                  ]}
                >
                  {extras?.listStyleType}
                </Text>
              )}
              <View style={styles.listItemContent as any}>{children}</View>
            </View>
          ),
        }}
        markdown={children}
      />
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

const fullStyles = StyleSheet.create({
  orderedBullet: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
  },
  unorderedBullet: {
    fontSize: 18,
    fontWeight: '900',
  },
});

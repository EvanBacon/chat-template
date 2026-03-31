import { Platform } from "react-native";
import type { StyleMap } from "./types";

export const defaultStyles: StyleMap = {
  root: {},
  heading1: {
    fontSize: 48,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 36,
    fontWeight: "600",
  },
  heading3: {
    fontSize: 32,
    fontWeight: "600",
  },
  heading4: {
    fontSize: 28,
    fontWeight: "600",
  },
  heading5: {
    fontSize: 24,
    fontWeight: "600",
  },
  heading6: {
    fontSize: 20,
    fontWeight: "600",
  },
  paragraph: {
    marginVertical: 8,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "100%",
  },
  strong: {
    fontWeight: "bold",
  },
  emphasis: {
    fontStyle: "italic",
  },
  text: {},
  thematicBreak: {
    flex: 1,
    height: 1,
    backgroundColor: "#0000006c",
    marginVertical: 8,
  },
  blockquote: {
    backgroundColor: "#f5f5f5",
    borderColor: "#3840ba",
    borderLeftWidth: 4,
    paddingHorizontal: 5,
    marginVertical: 8,
  },
  codeContainer: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  codeText: {
    color: "#1c1c1c",
    fontSize: 14,
    ...Platform.select({
      ios: {
        fontFamily: "ui-monospace",
      },
      android: {
        fontFamily: "monospace",
      },
    }),
  },
  inlineCode: {
    ...Platform.select({
      ios: {
        fontFamily: "ui-monospace",
      },
      android: {
        fontFamily: "monospace",
      },
    }),
    backgroundColor: "#f0f0f0",
  },
  link: {
    transform: [{ translateY: 2 }],
    fontSize: 16,
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: 300,
    aspectRatio: 1,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-start",
    gap: 8,
  },
  listBullet: {
    fontSize: 16,
    fontWeight: "900",
  },
  listItemContent: {
    flex: 1,
    flexWrap: "wrap",
  },
  delete: {
    textDecorationLine: "line-through",
  },
  // Table styles
  table: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeaderRow: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  tableHeaderCell: {
    backgroundColor: "#f5f5f5",
  },
  tableCellText: {
    fontSize: 14,
  },
  tableHeaderCellText: {
    fontWeight: "600",
  },
};

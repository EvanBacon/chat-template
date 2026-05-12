# Chat Template

https://github.com/user-attachments/assets/864ca10c-be94-4c45-8e98-a71bff7a0042

A high-performance AI chatbot template built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/). Ships with iOS 26 Liquid Glass support, a responsive web UI, and runs on iOS, Android, and web from a single codebase.

## Features

- **Liquid Glass** -- glassmorphic prompt composer, navigation bars, and toolbar buttons on iOS 26 via `expo-glass-effect`
- **Web-first sidebar** -- collapsible sidebar with Radix context menus, dropdown menus, and tooltips for a desktop-grade web experience
- **Streaming messages** with throttled ~30fps updates, markdown rendering (code blocks, tables, inline formatting), and shimmer loading states
- **Platform-adaptive layouts** -- native gesture-driven drawer on iOS/Android, sidebar + inset content panel on web
- **Dark mode** -- automatic light/dark theme using OKLCH design tokens in Tailwind CSS v4
- **Native UI controls** -- SwiftUI model picker menu, toolbar buttons, and haptic feedback on iOS
- **Keyboard-aware** -- prompt input stays above the keyboard with `react-native-keyboard-controller`
- **Virtualized chat** -- performant scrolling with `@legendapp/list` and Reanimated-powered scroll-to-bottom button

## Tech Stack

| Layer      | Technology                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Framework  | Expo SDK 55, React Native 0.83, React 19                                                                                |
| Navigation | Expo Router (file-based) with typed routes, [Legend List](https://legendapp.com/open-source/list/) for virtualized chat |
| Styling    | Tailwind CSS v4 via [Uniwind](https://uniwind.dev/) + `tailwind-merge`                                                  |
| Native UI  | `@expo/ui` (SwiftUI), `expo-symbols`, `expo-haptics`, `expo-glass-effect`                                               |
| Web UI     | Radix UI (context menu, dropdown menu, tooltips), Lucide icons                                                          |
| Markdown   | Custom AST renderer with `mdast-util-from-markdown` + `react-syntax-highlighter`                                        |
| Animations | `react-native-reanimated`, `react-native-gesture-handler`                                                               |

## Getting Started

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable              | Description                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`   | Your [Anthropic API key](https://console.anthropic.com/settings/keys). Used by the server-side chat API route (`app/api/chat+api.ts`) via `@ai-sdk/anthropic`. |
| `EXPO_PUBLIC_MOCK_AI` | Set to `1` to use mock streaming responses instead of calling the Anthropic API. Useful for UI development without an API key.                                 |

### Install & Run

```bash
# Install dependencies
bun install

# Start the dev server
bun start

# Run on a specific platform
bun run ios
bun run android
bun run web
```

> Requires [Bun](https://bun.sh) and the [Expo CLI](https://docs.expo.dev/get-started/installation/). For iOS, you'll need Xcode and a simulator or device.

## Customization

### Theme

Edit `global.css` to change the design tokens. Colors use OKLCH for perceptual uniformity across light and dark modes. The `@theme` block maps CSS variables to Tailwind classes:

```css
--app-background  ->  bg-background
--app-foreground  ->  text-foreground
--app-muted       ->  bg-muted
--app-border      ->  border-border
/* etc. */
```

### Chat Backend

The template ships with mock streaming responses in `app/index.tsx`. Replace `mockStreamResponse` with your API integration -- the streaming architecture (`createStreamingStore` + throttled token callback) is ready for real LLM APIs.

### Database

I recommend using Convex, which you can setup in a single command:

```
npx eas-cli@latest integrations:convex:connect
```

Pair this with [better-auth](https://labs.convex.dev/better-auth/framework-guides/expo) for authentication. Convex also has support for Expo Notifications: [Learn more](https://www.convex.dev/components/push-notifications).

## License

This template was made for https://agent.expo.dev and is made freely available under the MIT license.

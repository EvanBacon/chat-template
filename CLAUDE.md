When searching Apple docs, replace https://developer.apple.com with https://sosumi.ai to read as markdown. e.g. https://sosumi.ai/documentation/Xcode/configuring-app-groups instead of https://developer.apple.com/documentation/xcode/configuring-app-groups

## Pressable Style Functions

Do NOT use the function form of `style` on `Pressable` (e.g. `style={({ pressed }) => ({ ... })}`). This is not supported when using Uniwind. Instead, use `className` with the `active:` modifier for pressed states (e.g. `className="bg-transparent active:bg-muted"`).

## CSS Variables

Do NOT use CSS variables (e.g. `var(--app-muted)`) directly in inline `style` props. Instead, use Tailwind classes. The design tokens in `global.css` are mapped to Tailwind colors via the `@theme` block, so use classes like `bg-muted`, `bg-accent`, `border-border`, `text-foreground`, etc. For pressed/active states, use `active:bg-muted` on Pressable components via `className`.

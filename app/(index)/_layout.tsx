import { Stack, useRouter } from "expo-router";
import { useState } from "react";

const MODELS = [
  {
    id: "opus-4.6",
    label: "Opus 4.6",
    subtitle: "Most capable for ambitious work",
  },
  {
    id: "sonnet-4.6",
    label: "Sonnet 4.6",
    subtitle: "Most efficient for everyday tasks",
  },
  {
    id: "haiku-4.5",
    label: "Haiku 4.5",
    subtitle: "Fastest for quick answers",
  },
] as const;

const MORE_MODELS = [
  { id: "opus-4.5", label: "Opus 4.5" },
  { id: "opus-3", label: "Opus 3" },
  { id: "sonnet-4.5", label: "Sonnet 4.5" },
] as const;

export default function Layout() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState("sonnet-4.6");
  const [extendedThinking, setExtendedThinking] = useState(false);

  const selectedLabel =
    [...MODELS, ...MORE_MODELS].find((m) => m.id === selectedModel)?.label ??
    "Model";

  return (
    <Stack>
      <Stack.Screen
        name="chats"
        options={{
          title: "Chats",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button
            icon={"line.horizontal.3"}
            onPress={() => {
              router.setParams({ drawer: "open" });
            }}
          />
        </Stack.Toolbar>
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon="brain">
            <Stack.Toolbar.Menu inline>
              {MODELS.map((model) => (
                <Stack.Toolbar.MenuAction
                  key={model.id}
                  subtitle={model.subtitle}
                  isOn={selectedModel === model.id}
                  onPress={() => setSelectedModel(model.id)}
                >
                  {model.label}
                </Stack.Toolbar.MenuAction>
              ))}
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.MenuAction
              icon="brain"
              subtitle="Think longer for harder problems"
              isOn={extendedThinking}
              onPress={() => setExtendedThinking((prev) => !prev)}
            >
              Extended thinking
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.Menu title="More models">
              {MORE_MODELS.map((model) => (
                <Stack.Toolbar.MenuAction
                  key={model.id}
                  isOn={selectedModel === model.id}
                  onPress={() => setSelectedModel(model.id)}
                >
                  {model.label}
                </Stack.Toolbar.MenuAction>
              ))}
            </Stack.Toolbar.Menu>
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      </Stack.Screen>
    </Stack>
  );
}

import { Icon } from "@/components/icon";
import { useModel } from "@/components/model-context";
import { Link, Stack } from "expo-router";
import { ChevronDown, Glasses, Menu } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useDrawer } from "./drawer-content";

function HeaderTitleMenu() {
  const { models, selectedModel, extendedThinking } = useModel();
  const selected = models.find((m) => m.id === selectedModel);
  const subtitle = extendedThinking ? "Extended" : undefined;

  return (
    <Link href="/model-picker" asChild>
      <Pressable
        accessibilityRole="button"
        className="px-2 py-1 -mx-2 rounded-md active:bg-muted flex-1 flex-col items-center"
      >
        <View className="flex-row items-center gap-1">
          <Text className="text-[17px] font-semibold text-foreground">
            {selected?.label ?? "Model"}
          </Text>
          <Icon icon={ChevronDown} className="w-3 h-3 text-foreground" />
        </View>
        {subtitle && (
          <Text className="text-[12px] text-muted-foreground">{subtitle}</Text>
        )}
      </Pressable>
    </Link>
  );
}

export function MainHeader() {
  const { openDrawer } = useDrawer();
  return (
    <>
      <Stack.Screen.Title asChild>
        <HeaderTitleMenu />
      </Stack.Screen.Title>
      <Stack.Toolbar placement="left" asChild>
        <Pressable
          onPress={openDrawer}
          accessibilityLabel="Open drawer"
          accessibilityRole="button"
          className="p-2 -ml-1 active:opacity-60"
        >
          <Icon icon={Menu} className="w-6 h-6 text-foreground" />
        </Pressable>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right" asChild>
        <Pressable
          accessibilityLabel="Reader"
          accessibilityRole="button"
          className="p-2 -mr-1 active:opacity-60"
        >
          <Icon icon={Glasses} className="w-6 h-6 text-foreground" />
        </Pressable>
      </Stack.Toolbar>
    </>
  );
}

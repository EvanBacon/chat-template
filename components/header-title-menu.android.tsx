import { Icon } from "@/components/icon";
import { useModel } from "@/components/model-context";
import { Link } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export function HeaderTitleMenu() {
  const { models, selectedModel, extendedThinking } = useModel();
  const selected = models.find((m) => m.id === selectedModel);
  const subtitle = extendedThinking ? "Extended" : undefined;

  return (
    <Link href="/model-picker" asChild>
      <Pressable
        accessibilityRole="button"
        className="px-2 py-1 -mx-2 rounded-md active:bg-muted"
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

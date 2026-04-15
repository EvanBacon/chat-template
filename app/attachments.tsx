import { Image } from "@/components/tw";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

function AttachmentButton({ icon, label }: { icon: string; label: string }) {
  return (
    <Pressable
      className="flex-1 items-center gap-2 py-3 rounded-xl bg-secondary dark:bg-secondary active:bg-muted"
      style={{ borderCurve: "continuous" }}
    >
      <Image
        source={`sf:${icon}`}
        className="w-6 h-6 text-foreground dark:text-foreground"
      />
      <Text className="text-[13px] text-foreground dark:text-foreground">
        {label}
      </Text>
    </Pressable>
  );
}

function ToggleRow({
  icon,
  label,
  badge,
  value,
  onValueChange,
}: {
  icon: string;
  label: string;
  badge?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center px-5 py-3 gap-3.5">
      <Image
        source={`sf:${icon}`}
        className="w-5 h-5 text-foreground dark:text-foreground"
      />
      <Text className="flex-1 text-[17px] text-foreground dark:text-foreground">
        {label}
      </Text>
      {badge && (
        <View className="px-1.5 py-0.5 rounded bg-muted dark:bg-muted">
          <Text className="text-[11px] font-medium text-muted-foreground dark:text-muted-foreground">
            {badge}
          </Text>
        </View>
      )}
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function DisclosureRow({
  icon,
  label,
  detail,
  onPress,
}: {
  icon: string;
  label: string;
  detail: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-5 py-3.5 gap-3.5 active:bg-muted"
    >
      <Image
        source={`sf:${icon}`}
        className="w-5 h-5 text-foreground dark:text-foreground"
      />
      <Text className="flex-1 text-[17px] text-foreground dark:text-foreground">
        {label}
      </Text>
      <Text className="text-[15px] text-muted-foreground dark:text-muted-foreground">
        {detail}
      </Text>
      <Image
        source="sf:chevron.right"
        className="w-3 h-3 text-muted-foreground dark:text-muted-foreground"
      />
    </Pressable>
  );
}

export default function AddToChatSheet() {
  const [research, setResearch] = useState(false);
  const [webSearch, setWebSearch] = useState(true);

  return (
    <ScrollView className="flex-1 " contentInsetAdjustmentBehavior="automatic">
      {/* Attachment buttons */}
      <View className="flex-row gap-3 px-5 pt-2 pb-4">
        <AttachmentButton icon="camera" label="Camera" />
        <AttachmentButton icon="photo.on.rectangle" label="Photos" />
        <AttachmentButton icon="doc" label="Files" />
      </View>

      {/* Toggles */}
      <ToggleRow
        icon="sparkle.magnifyingglass"
        label="Research"
        value={research}
        onValueChange={setResearch}
      />
      <ToggleRow
        icon="globe"
        label="Web search"
        badge="Beta"
        value={webSearch}
        onValueChange={setWebSearch}
      />

      {/* Divider */}
      <View className="h-px bg-border dark:bg-border mx-5 my-1" />

      {/* Disclosure rows */}
      <DisclosureRow icon="archivebox" label="Add to project" detail="None" />
      <DisclosureRow icon="paintbrush" label="Choose style" detail="Normal" />
      <DisclosureRow icon="wrench" label="Tool access" detail="Auto" />
    </ScrollView>
  );
}

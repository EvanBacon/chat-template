import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
        }}
      >
        <Stack.Toolbar placement="left">
          <Stack.Toolbar.Button icon={"line.horizontal.3"} onPress={() => {}} />
        </Stack.Toolbar>
      </Stack.Screen>
    </Stack>
  );
}

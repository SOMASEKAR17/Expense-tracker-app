import { Stack } from "expo-router";

export default function SetupLayout() {
  return (
    <Stack>
      <Stack.Screen name="initial-balance" options={{ title: "Initial Balance" }} />
      <Stack.Screen name="primary-bank" options={{ title: "Primary Bank" }} />
      <Stack.Screen name="username" options={{ title: "Username" }} />
    </Stack>
  );
}

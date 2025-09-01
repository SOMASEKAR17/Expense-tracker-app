import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthGuard from "../components/AuthGuard";
import { SessionProvider } from "../components/session/SessionProvider";

export default function RootLayout() {
  useEffect(() => {}, []); // keeps reanimated happy

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <AuthGuard>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthGuard>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}

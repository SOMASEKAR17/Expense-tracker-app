// components/AuthGuard.tsx
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useSession } from "./session/SessionProvider";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (loading || !hasMounted.current) return;

    if (!user) {
      router.replace("/(auth)/login");
    }
  }, [loading, user]);

  if (loading) {
    return null; // or splash screen
  }

  return <>{children}</>;
}

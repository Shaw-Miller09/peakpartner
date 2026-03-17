import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";

export default function IndexScreen() {
  const { hasCompletedOnboarding, session } = useAuth();

  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}

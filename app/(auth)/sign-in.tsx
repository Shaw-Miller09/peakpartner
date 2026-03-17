import { router } from "expo-router";

import { AuthForm } from "@/components/auth/AuthForm";
import { Screen } from "@/components/common/Screen";
import { useAuth } from "@/hooks/useAuth";

export default function SignInScreen() {
  const { signIn } = useAuth();

  return (
    <Screen
      title="Meet your next mountain crew"
      subtitle="PeakPartner connects skiers and snowboarders for meetups, shared laps, and session tracking."
    >
      <AuthForm
        alternateLabel="Need an account? Create one"
        mode="sign-in"
        onAlternatePress={() => router.push("/(auth)/sign-up")}
        onSubmit={signIn}
      />
    </Screen>
  );
}

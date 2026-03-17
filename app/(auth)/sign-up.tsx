import { router } from "expo-router";

import { AuthForm } from "@/components/auth/AuthForm";
import { Screen } from "@/components/common/Screen";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpScreen() {
  const { signUp } = useAuth();

  return (
    <Screen
      title="Start building your ride network"
      subtitle="Sign up to create a profile, join meetups, and discover athletes riding your mountain."
    >
      <AuthForm
        alternateLabel="Already have an account? Sign in"
        mode="sign-up"
        onAlternatePress={() => router.push("/(auth)/sign-in")}
        onSubmit={signUp}
      />
    </Screen>
  );
}

import { Redirect, router } from "expo-router";
import { Alert } from "react-native";

import { AuthForm } from "@/components/auth/AuthForm";
import { Screen } from "@/components/common/Screen";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpScreen() {
  const { hasCompletedOnboarding, session, signUp } = useAuth();

  if (session) {
    return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/(onboarding)/welcome"} />;
  }

  return (
    <Screen
      title="Start building your ride network"
      subtitle="Sign up to create a profile, join meetups, and discover athletes riding your mountain."
    >
      <AuthForm
        alternateLabel="Already have an account? Sign in"
        mode="sign-up"
        onAlternatePress={() => router.push("/(auth)/sign-in")}
        onSubmit={async (email, password) => {
          const result = await signUp(email, password);

          if (result.needsEmailConfirmation) {
            Alert.alert(
              "Confirm your email",
              "Supabase created the user but did not return a session. If you want onboarding immediately after signup, disable Confirm email in Supabase: Authentication > Providers > Email."
            );
            router.replace("/(auth)/sign-in");
            return;
          }

          router.replace("/");
        }}
      />
    </Screen>
  );
}

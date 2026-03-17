import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/hooks/useAuth";

export default function PermissionsScreen() {
  const { completeOnboarding } = useAuth();

  const handleFinish = () => {
    completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <Screen
      title="Ready for discovery"
      subtitle="This final step is where location permissions, push notifications, and safety settings would be requested."
    >
      <OnboardingProgress step={2} total={3} />
      <PlaceholderCard
        heading="Step 3: Permissions"
        body="GPS tracking and meetup discovery will eventually depend on explicit location permissions and consent copy."
      />
      <Pressable onPress={handleFinish} style={styles.button}>
        <Text style={styles.buttonLabel}>Finish onboarding</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#124E78",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16
  }
});

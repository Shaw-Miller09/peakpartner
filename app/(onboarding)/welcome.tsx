import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

export default function WelcomeScreen() {
  return (
    <Screen
      title="Welcome to PeakPartner"
      subtitle="The onboarding flow is scaffolded as three steps: athlete identity, riding preferences, and discovery readiness."
    >
      <OnboardingProgress step={0} total={3} />
      <PlaceholderCard
        heading="Step 1: Athlete Identity"
        body="Collect display name, sport type, skill level, and home mountain."
      />
      <Link href="/(onboarding)/preferences" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonLabel}>Continue</Text>
        </Pressable>
      </Link>
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

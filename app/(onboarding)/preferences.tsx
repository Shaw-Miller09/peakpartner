import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";

export default function PreferencesScreen() {
  return (
    <Screen
      title="Riding preferences"
      subtitle="Use this step to capture terrain preferences, meetup interests, and whether the athlete skis, snowboards, or both."
    >
      <OnboardingProgress step={1} total={3} />
      <PlaceholderCard
        heading="Step 2: Preferences"
        body="Wire this into profile persistence once the Supabase profile queries are implemented."
      />
      <Link href="/(onboarding)/permissions" asChild>
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

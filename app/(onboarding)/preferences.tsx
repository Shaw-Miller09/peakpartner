import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { FormField } from "@/components/common/FormField";
import { PillSelector } from "@/components/common/PillSelector";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/hooks/useAuth";
import type { SnowSportType } from "@/models/profile";

const sportOptions: { label: string; value: SnowSportType }[] = [
  { label: "Ski", value: "ski" },
  { label: "Snowboard", value: "snowboard" },
  { label: "Both", value: "both" }
];

export default function PreferencesScreen() {
  const { onboardingDraft, updateOnboardingDraft } = useAuth();

  return (
    <Screen
      title="Riding preferences"
      subtitle="Set the sport value that will be stored on the profile row."
    >
      <OnboardingProgress step={1} total={3} />
      <FormField label="Sport">
        <PillSelector
          onChange={(sport) => updateOnboardingDraft({ sport })}
          options={sportOptions}
          selectedValue={onboardingDraft.sport}
        />
      </FormField>
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

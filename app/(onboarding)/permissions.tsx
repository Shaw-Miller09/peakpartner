import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text } from "react-native";

import { FormField } from "@/components/common/FormField";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/hooks/useAuth";

export default function PermissionsScreen() {
  const { onboardingDraft, saveOnboardingProfile } = useAuth();

  const handleFinish = async () => {
    try {
      await saveOnboardingProfile();
      router.replace("/(tabs)");
    } catch (error) {
      console.error("[onboarding] finish failed", error);
      Alert.alert(
        "Unable to finish onboarding",
        error instanceof Error ? error.message : "Unable to save profile."
      );
    }
  };

  return (
    <Screen
      title="Ready for discovery"
      subtitle="Finish onboarding to persist your profile row and unlock the app."
    >
      <OnboardingProgress step={2} total={3} />
      <FormField label="Profile summary">
        <Text style={styles.summaryText}>Email: {onboardingDraft.email || "Missing email"}</Text>
        <Text style={styles.summaryText}>Name: {onboardingDraft.name || "Missing name"}</Text>
        <Text style={styles.summaryText}>Sport: {onboardingDraft.sport}</Text>
      </FormField>
      <Pressable onPress={() => void handleFinish()} style={styles.button}>
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
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#35566F"
  }
});

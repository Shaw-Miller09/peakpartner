import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

import { FormField } from "@/components/common/FormField";
import { Screen } from "@/components/common/Screen";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { useAuth } from "@/hooks/useAuth";

export default function WelcomeScreen() {
  const { onboardingDraft, updateOnboardingDraft } = useAuth();

  return (
    <Screen
      title="Welcome to PeakPartner"
      subtitle="Capture the basics first so your profile row can be saved cleanly after signup."
    >
      <OnboardingProgress step={0} total={3} />
      <FormField label="Email">
        <TextInput
          editable={false}
          placeholder="Email"
          placeholderTextColor="#7A8EA2"
          style={[styles.input, styles.inputDisabled]}
          value={onboardingDraft.email}
        />
      </FormField>
      <FormField label="Name" helperText="This will be saved to `profiles.full_name`.">
        <TextInput
          onChangeText={(name) => updateOnboardingDraft({ name })}
          placeholder="Alex Carter"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={onboardingDraft.name}
        />
      </FormField>
      <Link href="/(onboarding)/preferences" asChild>
        <Pressable
          disabled={!onboardingDraft.name.trim()}
          style={[styles.button, !onboardingDraft.name.trim() ? styles.buttonDisabled : undefined]}
        >
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
  buttonDisabled: {
    opacity: 0.5
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: "#10233C"
  },
  inputDisabled: {
    color: "#617A92",
    backgroundColor: "#EEF4F9"
  }
});

import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  onSubmit: (email: string, password: string) => Promise<void>;
  alternateLabel: string;
  onAlternatePress: () => void;
};

export function AuthForm({ mode, onSubmit, alternateLabel, onAlternatePress }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = mode === "sign-in" ? "Sign In" : "Create Account";

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(email.trim(), password);
    } catch (error) {
      Alert.alert("Authentication failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#7A8EA2"
        style={styles.input}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#7A8EA2"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <Pressable disabled={isSubmitting} onPress={handleSubmit} style={styles.primaryButton}>
        <Text style={styles.primaryLabel}>{isSubmitting ? "Working..." : submitLabel}</Text>
      </Pressable>
      <Pressable onPress={onAlternatePress} style={styles.secondaryButton}>
        <Text style={styles.secondaryLabel}>{alternateLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12
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
  primaryButton: {
    backgroundColor: "#124E78",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14
  },
  primaryLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 8
  },
  secondaryLabel: {
    color: "#124E78",
    fontSize: 14,
    fontWeight: "500"
  }
});

import { Pressable, StyleSheet, Text } from "react-native";

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <Screen
      title="Profile"
      subtitle="Profile setup will eventually edit the persisted `profiles` row and expose athlete stats and ratings."
    >
      <PlaceholderCard
        heading="Athlete profile"
        body="Display home mountain, disciplines, skill level, and social proof here."
      />
      <Pressable onPress={() => void signOut()} style={styles.button}>
        <Text style={styles.buttonLabel}>Sign Out</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#10233C",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 14
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});

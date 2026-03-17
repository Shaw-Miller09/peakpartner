import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function HomeScreen() {
  return (
    <Screen
      title="PeakPartner"
      subtitle="Home is the orchestration surface for discovery, meetup creation, active chats, and current ride stats."
    >
      <PlaceholderCard
        heading="Feed placeholder"
        body="Recent meetups, rider activity, and recommended athletes would land here."
      />
      <Link href="/meetups/create" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonLabel}>Create Meetup</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#124E78",
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

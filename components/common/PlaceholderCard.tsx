import { StyleSheet, Text, View } from "react-native";

type PlaceholderCardProps = {
  heading: string;
  body: string;
};

export function PlaceholderCard({ heading, body }: PlaceholderCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#D8E3EE"
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#14304D"
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4C637B"
  }
});

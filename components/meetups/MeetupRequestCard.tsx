import { Pressable, StyleSheet, Text, View } from "react-native";

type MeetupRequestCardProps = {
  name: string;
  note: string | null;
  onApprove: () => void;
  onDecline: () => void;
};

export function MeetupRequestCard({
  name,
  note,
  onApprove,
  onDecline
}: MeetupRequestCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.note}>{note ?? "No message attached."}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onApprove} style={[styles.button, styles.approveButton]}>
          <Text style={[styles.buttonLabel, styles.approveLabel]}>Approve</Text>
        </Pressable>
        <Pressable onPress={onDecline} style={[styles.button, styles.declineButton]}>
          <Text style={[styles.buttonLabel, styles.declineLabel]}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8E3EE",
    padding: 14,
    gap: 10
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14304D"
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: "#47627B"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  button: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12
  },
  approveButton: {
    backgroundColor: "#DFF2E5"
  },
  declineButton: {
    backgroundColor: "#FCE7E9"
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "700"
  },
  approveLabel: {
    color: "#17633A"
  },
  declineLabel: {
    color: "#9F2432"
  }
});

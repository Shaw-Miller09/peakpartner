import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { MeetupCardView } from "@/models/meetup";
import {
  formatMeetupDateTime,
  getAgePoolLabel,
  getMeetupTypeLabel
} from "@/services/meetups/meetupLogic";

type MeetupCardProps = {
  item: MeetupCardView;
};

function Tag({ children }: { children: string | number }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagLabel}>{children}</Text>
    </View>
  );
}

export function MeetupCard({ item }: MeetupCardProps) {
  const schedule = formatMeetupDateTime(item.meetup.scheduledFor);

  return (
    <Link
      href={{
        pathname: "/meetups/[meetupId]",
        params: { meetupId: item.meetup.id }
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>{item.meetup.title}</Text>
            <Text style={styles.host}>Hosted by {item.host.fullName ?? item.host.username}</Text>
          </View>
          <Text style={styles.actionText}>{item.action.label}</Text>
        </View>

        <Text style={styles.location}>{item.meetup.mountainName}</Text>
        <Text style={styles.datetime}>
          {schedule.date} at {schedule.time}
        </Text>

        <View style={styles.tags}>
          <Tag>{item.meetup.skillLevel ?? "All levels"}</Tag>
          <Tag>{getMeetupTypeLabel(item.meetup.meetupType)}</Tag>
          <Tag>{item.meetup.sportType}</Tag>
          <Tag>{`${item.participantCount}/${item.meetup.maxGroupSize ?? "?"} riders`}</Tag>
          <Tag>{getAgePoolLabel(item.meetup)}</Tag>
        </View>

        {item.meetup.notes ? <Text style={styles.notes}>{item.meetup.notes}</Text> : null}
        <Text style={styles.meta}>{item.visibilityNote}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#D6E3EE"
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  titleGroup: {
    flex: 1,
    gap: 4
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10233C"
  },
  host: {
    fontSize: 13,
    color: "#57708A"
  },
  actionText: {
    fontSize: 12,
    color: "#124E78",
    fontWeight: "600"
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14304D"
  },
  datetime: {
    fontSize: 14,
    color: "#49627A"
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  tag: {
    borderRadius: 999,
    backgroundColor: "#EEF5FB",
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  tagLabel: {
    fontSize: 12,
    color: "#124E78",
    fontWeight: "600"
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
    color: "#34536D"
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6A8094"
  }
});

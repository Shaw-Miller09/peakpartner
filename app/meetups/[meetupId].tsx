import type { ReactNode } from "react";
import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { MeetupRequestCard } from "@/components/meetups/MeetupRequestCard";
import { useMeetupDetail } from "@/hooks/useMeetupDetail";
import {
  formatMeetupDateTime,
  getAgePoolLabel,
  getMeetupTypeLabel
} from "@/services/meetups/meetupLogic";

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  disabled
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.actionButton, disabled ? styles.actionButtonDisabled : undefined]}>
      <Text style={styles.actionButtonLabel}>{label}</Text>
    </Pressable>
  );
}

export default function MeetupDetailScreen() {
  const params = useLocalSearchParams<{ meetupId: string }>();
  const {
    approveRequest,
    declineRequest,
    detail,
    joinMeetup,
    requestJoin
  } = useMeetupDetail(params.meetupId);

  if (!detail) {
    return (
      <Screen title="Meetup not found" subtitle="This meetup no longer exists in the current mock store.">
        <Text>Refresh discovery and choose another meetup.</Text>
      </Screen>
    );
  }

  const schedule = formatMeetupDateTime(detail.meetup.scheduledFor);

  return (
    <Screen
      title={detail.meetup.title}
      subtitle={`${detail.meetup.mountainName} on ${schedule.date} at ${schedule.time}`}
    >
      <View style={styles.heroCard}>
        <Text style={styles.heroMeta}>Hosted by {detail.host.fullName ?? detail.host.username}</Text>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>{detail.meetup.skillLevel ?? "All levels"}</Text>
          <Text style={styles.badge}>{getMeetupTypeLabel(detail.meetup.meetupType)}</Text>
          <Text style={styles.badge}>{detail.meetup.sportType}</Text>
          <Text style={styles.badge}>{getAgePoolLabel(detail.meetup)}</Text>
        </View>
        <Text style={styles.description}>
          {detail.meetup.notes ?? detail.meetup.description ?? "No extra notes from the host yet."}
        </Text>
      </View>

      <DetailSection title="Meetup info">
        <Text style={styles.infoLine}>Max group size: {detail.meetup.maxGroupSize ?? "Not set"}</Text>
        <Text style={styles.infoLine}>Participants: {detail.participantCount}</Text>
        <Text style={styles.infoLine}>Meetup type: {getMeetupTypeLabel(detail.meetup.meetupType)}</Text>
        <Text style={styles.infoLine}>Visibility: {detail.visibilityNote}</Text>
        {detail.action.reason ? <Text style={styles.reason}>{detail.action.reason}</Text> : null}
      </DetailSection>

      {detail.action.mode === "join" ? (
        <ActionButton label={detail.action.label} onPress={() => joinMeetup(detail.meetup.id)} />
      ) : null}

      {detail.action.mode === "request" ? (
        <ActionButton label={detail.action.label} onPress={() => requestJoin(detail.meetup.id)} />
      ) : null}

      {detail.action.mode === "none" ? (
        <View style={styles.statusPanel}>
          <Text style={styles.statusTitle}>{detail.action.label}</Text>
          <Text style={styles.statusBody}>{detail.action.reason ?? "No further action is available."}</Text>
        </View>
      ) : null}

      {detail.meetup.meetupType === "private" ? (
        <DetailSection title="Private access logic">
          <Text style={styles.infoLine}>
            Invited: {detail.isInvited ? "Yes" : "No"}
          </Text>
          <Text style={styles.infoLine}>
            Connected to host: {detail.isConnectedToHost ? "Yes" : "No"}
          </Text>
          <Text style={styles.reason}>
            Private meetups can cross age groups, but only for invited riders or accepted connections.
          </Text>
        </DetailSection>
      ) : null}

      <DetailSection title="Participants">
        <View style={styles.list}>
          {detail.participants.map(({ participant, profile }) => (
            <View key={participant.id} style={styles.listCard}>
              <Text style={styles.listTitle}>{profile.fullName ?? profile.username}</Text>
              <Text style={styles.listBody}>
                {participant.role === "host" ? "Host" : "Participant"} · {profile.sportType} · {profile.skillLevel ?? "Level not set"}
              </Text>
            </View>
          ))}
        </View>
      </DetailSection>

      {detail.canManageRequests ? (
        <DetailSection title={`Pending requests (${detail.pendingRequests.length})`}>
          {detail.pendingRequests.length === 0 ? (
            <View style={styles.statusPanel}>
              <Text style={styles.statusTitle}>No pending requests</Text>
              <Text style={styles.statusBody}>Approval meetups will surface rider requests here for the host.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {detail.pendingRequests.map(({ profile, request }) => (
                <MeetupRequestCard
                  key={request.id}
                  name={profile.fullName ?? profile.username}
                  note={request.message}
                  onApprove={() => approveRequest(request.id)}
                  onDecline={() => declineRequest(request.id)}
                />
              ))}
            </View>
          )}
        </DetailSection>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D8E3EE",
    padding: 18,
    gap: 12
  },
  heroMeta: {
    fontSize: 14,
    color: "#5A748D",
    fontWeight: "600"
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  badge: {
    backgroundColor: "#EEF5FB",
    color: "#124E78",
    fontWeight: "700",
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    overflow: "hidden"
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#36536C"
  },
  section: {
    gap: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14304D"
  },
  infoLine: {
    fontSize: 15,
    lineHeight: 22,
    color: "#36536C"
  },
  reason: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5E7690"
  },
  actionButton: {
    backgroundColor: "#124E78",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 15
  },
  actionButtonDisabled: {
    opacity: 0.6
  },
  actionButtonLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16
  },
  statusPanel: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 18,
    padding: 16,
    gap: 8
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14304D"
  },
  statusBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B657D"
  },
  list: {
    gap: 10
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 18,
    padding: 14,
    gap: 6
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#14304D"
  },
  listBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B657D"
  }
});

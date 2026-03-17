import type {
  AthleteConnection,
  CreateMeetupInput,
  Meetup,
  MeetupActionState,
  MeetupCardView,
  MeetupDetailView,
  MeetupFilters,
  MeetupJoinRequest,
  MeetupParticipant
} from "@/models/meetup";
import { getAgePoolForMeetupType } from "@/models/meetup";
import type { Profile } from "@/models/profile";

type MeetupDomainState = {
  profiles: Profile[];
  connections: AthleteConnection[];
  meetups: Meetup[];
  participants: MeetupParticipant[];
  joinRequests: MeetupJoinRequest[];
};

function byScheduledSoonest(left: Meetup, right: Meetup) {
  return new Date(left.scheduledFor).getTime() - new Date(right.scheduledFor).getTime();
}

export function createInitialFilters(): MeetupFilters {
  return {
    mountain: "",
    date: "",
    skillLevel: "all",
    meetupType: "all",
    sportType: "all"
  };
}

export function formatMeetupDateTime(value: string) {
  const date = new Date(value);

  return {
    date: new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      weekday: "short"
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit"
    }).format(date)
  };
}

export function getAgePoolLabel(meetup: Meetup) {
  switch (meetup.agePool) {
    case "adult_only":
      return "Adults";
    case "minor_only":
      return "Minors";
    default:
      return "Connections";
  }
}

export function getMeetupTypeLabel(meetupType: Meetup["meetupType"]) {
  switch (meetupType) {
    case "public_open":
      return "Public Open";
    case "public_approval":
      return "Approval Required";
    case "private":
      return "Private";
  }
}

export function isConnected(connections: AthleteConnection[], currentProfileId: string, otherProfileId: string) {
  return connections.some((connection) => {
    if (connection.status !== "accepted") {
      return false;
    }

    return (
      (connection.requesterId === currentProfileId && connection.addresseeId === otherProfileId) ||
      (connection.requesterId === otherProfileId && connection.addresseeId === currentProfileId)
    );
  });
}

function getProfile(profiles: Profile[], profileId: string) {
  return profiles.find((profile) => profile.id === profileId) ?? null;
}

function getParticipantCount(participants: MeetupParticipant[], meetupId: string) {
  return participants.filter((participant) => participant.meetupId === meetupId).length;
}

function getPendingRequestCount(joinRequests: MeetupJoinRequest[], meetupId: string) {
  return joinRequests.filter(
    (joinRequest) => joinRequest.meetupId === meetupId && joinRequest.status === "pending"
  ).length;
}

function isParticipant(participants: MeetupParticipant[], meetupId: string, profileId: string) {
  return participants.some(
    (participant) => participant.meetupId === meetupId && participant.profileId === profileId
  );
}

function getPendingRequest(joinRequests: MeetupJoinRequest[], meetupId: string, profileId: string) {
  return (
    joinRequests.find(
      (joinRequest) =>
        joinRequest.meetupId === meetupId &&
        joinRequest.profileId === profileId &&
        joinRequest.status === "pending"
    ) ?? null
  );
}

function isMeetupFull(meetup: Meetup, participants: MeetupParticipant[]) {
  return meetup.maxGroupSize !== null && getParticipantCount(participants, meetup.id) >= meetup.maxGroupSize;
}

function isPrivateMeetupVisible(
  meetup: Meetup,
  currentProfileId: string,
  connections: AthleteConnection[]
) {
  if (meetup.hostId === currentProfileId) {
    return true;
  }

  return (
    meetup.invitedProfileIds.includes(currentProfileId) ||
    isConnected(connections, currentProfileId, meetup.hostId)
  );
}

export function isMeetupVisibleToProfile(
  meetup: Meetup,
  currentProfile: Profile,
  host: Profile,
  connections: AthleteConnection[]
) {
  if (meetup.hostId === currentProfile.id) {
    return true;
  }

  if (meetup.meetupType === "private") {
    return isPrivateMeetupVisible(meetup, currentProfile.id, connections);
  }

  return currentProfile.ageGroup === host.ageGroup;
}

function matchesFilters(meetup: Meetup, filters: MeetupFilters) {
  if (
    filters.mountain.trim() &&
    !meetup.mountainName.toLowerCase().includes(filters.mountain.trim().toLowerCase())
  ) {
    return false;
  }

  if (filters.date && !meetup.scheduledFor.startsWith(filters.date)) {
    return false;
  }

  if (filters.skillLevel !== "all" && meetup.skillLevel !== filters.skillLevel) {
    return false;
  }

  if (filters.meetupType !== "all" && meetup.meetupType !== filters.meetupType) {
    return false;
  }

  if (filters.sportType !== "all" && meetup.sportType !== filters.sportType) {
    return false;
  }

  return true;
}

export function getMeetupActionState(
  meetup: Meetup,
  currentProfile: Profile,
  host: Profile,
  participants: MeetupParticipant[],
  joinRequests: MeetupJoinRequest[],
  connections: AthleteConnection[]
): MeetupActionState {
  if (meetup.hostId === currentProfile.id) {
    return {
      label: "Hosting this meetup",
      mode: "none",
      reason: "You can manage requests and participants below."
    };
  }

  if (isParticipant(participants, meetup.id, currentProfile.id)) {
    return {
      label: "Already joined",
      mode: "none",
      reason: "You are already in this meetup."
    };
  }

  if (getPendingRequest(joinRequests, meetup.id, currentProfile.id)) {
    return {
      label: "Request pending",
      mode: "none",
      reason: "The host still needs to review your join request."
    };
  }

  if (meetup.status !== "open") {
    return {
      label: "Unavailable",
      mode: "none",
      disabled: true,
      reason: "This meetup is no longer open for new riders."
    };
  }

  if (isMeetupFull(meetup, participants)) {
    return {
      label: "Meetup full",
      mode: "none",
      disabled: true,
      reason: "The group has reached its max size."
    };
  }

  if (meetup.meetupType === "private") {
    const connected = isConnected(connections, currentProfile.id, host.id);
    const invited = meetup.invitedProfileIds.includes(currentProfile.id);

    if (!connected && !invited) {
      return {
        label: "Private meetup",
        mode: "none",
        disabled: true,
        reason: "Only invited riders or accepted connections can join this meetup."
      };
    }

    return {
      label: invited ? "Join private meetup" : "Join as connection",
      mode: "join",
      reason: invited
        ? "You were invited directly by the host."
        : "Private meetups allow accepted connections to join across age groups."
    };
  }

  if (currentProfile.ageGroup !== host.ageGroup) {
    return {
      label: "Age gated",
      mode: "none",
      disabled: true,
      reason: "Public stranger discovery is restricted to the host's age group."
    };
  }

  if (meetup.meetupType === "public_open") {
    return {
      label: "Join meetup",
      mode: "join",
      reason: "Open public meetup. Eligible riders join instantly."
    };
  }

  return {
    label: "Request to join",
    mode: "request",
    reason: "Host approval is required before you are added to this meetup."
  };
}

function getVisibilityNote(meetup: Meetup, currentProfile: Profile, host: Profile) {
  if (meetup.meetupType === "private") {
    return "Visible because you are invited or connected to the host.";
  }

  if (currentProfile.ageGroup === host.ageGroup) {
    return "Visible within your public age pool.";
  }

  return "Hidden by public age-safety rules.";
}

export function buildMeetupCardViews(
  state: MeetupDomainState,
  currentProfile: Profile,
  filters: MeetupFilters
) {
  return state.meetups
    .slice()
    .sort(byScheduledSoonest)
    .filter((meetup) => {
      const host = getProfile(state.profiles, meetup.hostId);
      if (!host) {
        return false;
      }

      return isMeetupVisibleToProfile(meetup, currentProfile, host, state.connections);
    })
    .filter((meetup) => matchesFilters(meetup, filters))
    .map<MeetupCardView>((meetup) => {
      const host = getProfile(state.profiles, meetup.hostId);
      if (!host) {
        throw new Error(`Missing host profile for meetup ${meetup.id}`);
      }

      return {
        meetup,
        host,
        participantCount: getParticipantCount(state.participants, meetup.id),
        pendingRequestCount: getPendingRequestCount(state.joinRequests, meetup.id),
        action: getMeetupActionState(
          meetup,
          currentProfile,
          host,
          state.participants,
          state.joinRequests,
          state.connections
        ),
        visibilityNote: getVisibilityNote(meetup, currentProfile, host)
      };
    });
}

export function buildMeetupDetailView(
  state: MeetupDomainState,
  meetupId: string,
  currentProfile: Profile
): MeetupDetailView | null {
  const meetup = state.meetups.find((item) => item.id === meetupId);

  if (!meetup) {
    return null;
  }

  const host = getProfile(state.profiles, meetup.hostId);
  if (!host) {
    return null;
  }

  const participants = state.participants
    .filter((participant) => participant.meetupId === meetupId)
    .map((participant) => {
      const profile = getProfile(state.profiles, participant.profileId);
      if (!profile) {
        throw new Error(`Missing participant profile for meetup ${meetupId}`);
      }

      return { participant, profile };
    });

  const pendingRequests = state.joinRequests
    .filter((joinRequest) => joinRequest.meetupId === meetupId && joinRequest.status === "pending")
    .map((request) => {
      const profile = getProfile(state.profiles, request.profileId);
      if (!profile) {
        throw new Error(`Missing requester profile for meetup ${meetupId}`);
      }

      return { request, profile };
    });

  return {
    meetup,
    host,
    participantCount: participants.length,
    pendingRequestCount: pendingRequests.length,
    action: getMeetupActionState(
      meetup,
      currentProfile,
      host,
      state.participants,
      state.joinRequests,
      state.connections
    ),
    visibilityNote: getVisibilityNote(meetup, currentProfile, host),
    isHost: meetup.hostId === currentProfile.id,
    isParticipant: isParticipant(state.participants, meetup.id, currentProfile.id),
    canManageRequests: meetup.hostId === currentProfile.id,
    isConnectedToHost: isConnected(state.connections, currentProfile.id, host.id),
    isInvited: meetup.invitedProfileIds.includes(currentProfile.id),
    participants,
    pendingRequests
  };
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toScheduledFor(date: string, startTime: string) {
  return new Date(`${date}T${startTime}:00`).toISOString();
}

export function createMeetupFromInput(input: CreateMeetupInput, currentProfile: Profile): Meetup {
  const agePool = getAgePoolForMeetupType(input.meetupType, currentProfile.ageGroup);
  const now = new Date().toISOString();

  return {
    id: nextId("meetup"),
    hostId: currentProfile.id,
    title: input.title.trim(),
    description: input.notes.trim() || null,
    mountainName: input.mountainName.trim(),
    scheduledFor: toScheduledFor(input.date, input.startTime),
    meetingPoint: null,
    maxGroupSize: input.maxGroupSize,
    skillLevel: input.skillLevel,
    sportType: input.sportType,
    meetupType: input.meetupType,
    notes: input.notes.trim() || null,
    agePool: agePool.agePool,
    invitedProfileIds: [],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  };
}

export function createHostParticipant(meetupId: string, profileId: string): MeetupParticipant {
  return {
    id: nextId("participant"),
    meetupId,
    profileId,
    role: "host",
    joinedAt: new Date().toISOString()
  };
}

export function createJoinParticipant(meetupId: string, profileId: string): MeetupParticipant {
  return {
    id: nextId("participant"),
    meetupId,
    profileId,
    role: "participant",
    joinedAt: new Date().toISOString()
  };
}

export function createJoinRequest(meetupId: string, profileId: string): MeetupJoinRequest {
  return {
    id: nextId("request"),
    meetupId,
    profileId,
    message: "Requesting to join from the mobile app.",
    status: "pending",
    createdAt: new Date().toISOString()
  };
}

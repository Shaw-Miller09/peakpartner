import type { AgeGroup, Profile } from "@/models/profile";

export type MeetupStatus = "draft" | "open" | "full" | "completed" | "cancelled";
export type MeetupSportType = "ski" | "snowboard" | "mixed";
export type MeetupSkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type MeetupType = "public_open" | "public_approval" | "private";
export type MeetupAgePool = "minor_only" | "adult_only" | "connections_only";

export interface Meetup {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  mountainName: string;
  scheduledFor: string;
  meetingPoint: string | null;
  maxGroupSize: number | null;
  skillLevel: MeetupSkillLevel | null;
  sportType: MeetupSportType;
  meetupType: MeetupType;
  notes: string | null;
  agePool: MeetupAgePool;
  invitedProfileIds: string[];
  latitude: number | null;
  longitude: number | null;
  status: MeetupStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MeetupParticipant {
  id: string;
  meetupId: string;
  profileId: string;
  role: "host" | "participant";
  joinedAt: string;
}

export interface MeetupJoinRequest {
  id: string;
  meetupId: string;
  profileId: string;
  message: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  createdAt: string;
}

export interface AthleteConnection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
}

export interface MeetupFilters {
  mountain: string;
  date: string;
  skillLevel: MeetupSkillLevel | "all";
  meetupType: MeetupType | "all";
  sportType: MeetupSportType | "all";
}

export interface CreateMeetupInput {
  title: string;
  sportType: MeetupSportType;
  mountainName: string;
  date: string;
  startTime: string;
  skillLevel: MeetupSkillLevel;
  meetupType: MeetupType;
  maxGroupSize: number;
  notes: string;
}

export interface MeetupActionState {
  label: string;
  mode: "join" | "request" | "none";
  disabled?: boolean;
  reason?: string;
}

export interface MeetupCardView {
  meetup: Meetup;
  host: Profile;
  participantCount: number;
  pendingRequestCount: number;
  action: MeetupActionState;
  visibilityNote: string;
}

export interface MeetupDetailView extends MeetupCardView {
  isHost: boolean;
  isParticipant: boolean;
  canManageRequests: boolean;
  isConnectedToHost: boolean;
  isInvited: boolean;
  participants: Array<{
    participant: MeetupParticipant;
    profile: Profile;
  }>;
  pendingRequests: Array<{
    request: MeetupJoinRequest;
    profile: Profile;
  }>;
}

export type AgePoolExplanation = {
  agePool: MeetupAgePool;
  label: string;
  detail: string;
};

export function getAgePoolForMeetupType(meetupType: MeetupType, ageGroup: AgeGroup): AgePoolExplanation {
  if (meetupType === "private") {
    return {
      agePool: "connections_only",
      label: "Connections and invites",
      detail: "Private meetups can include connected or invited riders across age groups."
    };
  }

  return {
    agePool: ageGroup === "adult" ? "adult_only" : "minor_only",
    label: ageGroup === "adult" ? "Adult public pool" : "Minor public pool",
    detail: "Public stranger discovery is restricted to riders in the same age group."
  };
}

import type { Meetup } from "@/models/meetup";
import type { Profile } from "@/models/profile";

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
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

export interface Message {
  id: string;
  meetupId: string | null;
  senderId: string;
  recipientId: string | null;
  body: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  meetupId: string;
  raterId: string;
  ratedProfileId: string;
  score: number;
  review: string | null;
  createdAt: string;
}

export interface VideoPost {
  id: string;
  profileId: string;
  caption: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  mountainName: string | null;
  createdAt: string;
}

export interface TrackedSession {
  id: string;
  profileId: string;
  startedAt: string;
  endedAt: string | null;
  distanceMeters: number | null;
  verticalMeters: number | null;
  averageSpeedMps: number | null;
  createdAt: string;
}

export interface RoutePoint {
  id: string;
  trackedSessionId: string;
  recordedAt: string;
  latitude: number;
  longitude: number;
  elevationMeters: number | null;
  speedMps: number | null;
}

export interface AppDataModel {
  profiles: Profile[];
  meetups: Meetup[];
}

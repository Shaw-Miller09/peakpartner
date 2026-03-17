export type MeetupStatus = "draft" | "open" | "full" | "completed" | "cancelled";

export interface Meetup {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  mountainName: string;
  scheduledFor: string;
  meetingPoint: string | null;
  maxParticipants: number | null;
  skillLevel: string | null;
  sportType: "ski" | "snowboard" | "mixed";
  latitude: number | null;
  longitude: number | null;
  status: MeetupStatus;
  createdAt: string;
  updatedAt: string;
}

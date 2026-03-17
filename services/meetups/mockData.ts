import type {
  AthleteConnection,
  Meetup,
  MeetupJoinRequest,
  MeetupParticipant
} from "@/models/meetup";
import type { Profile } from "@/models/profile";

export const demoCurrentProfileId = "profile-current";

const now = new Date("2026-03-16T08:00:00.000Z").toISOString();

export const mockProfiles: Profile[] = [
  {
    id: demoCurrentProfileId,
    username: "ridge.rider",
    fullName: "Alex Carter",
    bio: "Weekend snowboarder chasing groomers and side hits.",
    homeMountain: "Mammoth Mountain",
    sportType: "snowboard",
    skillLevel: "intermediate",
    avatarUrl: null,
    latitude: null,
    longitude: null,
    ageGroup: "adult",
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile-host-1",
    username: "powderpatrol",
    fullName: "Jamie Lee",
    bio: "Skiing first chair to last lap.",
    homeMountain: "Mammoth Mountain",
    sportType: "ski",
    skillLevel: "advanced",
    avatarUrl: null,
    latitude: null,
    longitude: null,
    ageGroup: "adult",
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile-host-2",
    username: "parkprogression",
    fullName: "Taylor Nguyen",
    bio: "Learning new tricks every session.",
    homeMountain: "Big Bear",
    sportType: "snowboard",
    skillLevel: "beginner",
    avatarUrl: null,
    latitude: null,
    longitude: null,
    ageGroup: "minor",
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile-guest-1",
    username: "edgecontrol",
    fullName: "Sam Rivera",
    bio: "Cruising blues and finding good trees.",
    homeMountain: "Mammoth Mountain",
    sportType: "both",
    skillLevel: "intermediate",
    avatarUrl: null,
    latitude: null,
    longitude: null,
    ageGroup: "adult",
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "profile-guest-2",
    username: "juniorjumps",
    fullName: "Morgan Bell",
    bio: "Park laps and hot chocolate breaks.",
    homeMountain: "Big Bear",
    sportType: "snowboard",
    skillLevel: "beginner",
    avatarUrl: null,
    latitude: null,
    longitude: null,
    ageGroup: "minor",
    onboardingCompleted: true,
    createdAt: now,
    updatedAt: now
  }
];

export const mockConnections: AthleteConnection[] = [
  {
    id: "connection-1",
    requesterId: demoCurrentProfileId,
    addresseeId: "profile-host-1",
    status: "accepted",
    createdAt: now
  },
  {
    id: "connection-2",
    requesterId: demoCurrentProfileId,
    addresseeId: "profile-host-2",
    status: "accepted",
    createdAt: now
  }
];

export const mockMeetups: Meetup[] = [
  {
    id: "meetup-1",
    hostId: "profile-host-1",
    title: "Mammoth Early Chair Crew",
    description: "Warm-up groomers, then a few black runs before lunch.",
    mountainName: "Mammoth Mountain",
    scheduledFor: "2026-03-20T15:30:00.000Z",
    meetingPoint: "Main Lodge sign",
    maxGroupSize: 6,
    skillLevel: "intermediate",
    sportType: "mixed",
    meetupType: "public_open",
    notes: "Keep a steady pace and regroup after each run.",
    agePool: "adult_only",
    invitedProfileIds: [],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "meetup-2",
    hostId: "profile-host-1",
    title: "Sunset Park Session",
    description: "Focused progression session on medium features.",
    mountainName: "Mammoth Mountain",
    scheduledFor: "2026-03-21T22:00:00.000Z",
    meetingPoint: "Unbound chair base",
    maxGroupSize: 4,
    skillLevel: "advanced",
    sportType: "snowboard",
    meetupType: "public_approval",
    notes: "Message your current trick goals when requesting to join.",
    agePool: "adult_only",
    invitedProfileIds: [],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "meetup-3",
    hostId: "profile-host-2",
    title: "Private Big Bear Progression Laps",
    description: "Connection-based meetup with a relaxed pace for mixed experience levels.",
    mountainName: "Big Bear",
    scheduledFor: "2026-03-23T18:00:00.000Z",
    meetingPoint: "Bear Mountain ticket windows",
    maxGroupSize: 5,
    skillLevel: "beginner",
    sportType: "snowboard",
    meetupType: "private",
    notes: "Private meetup shared with invited riders and existing connections.",
    agePool: "connections_only",
    invitedProfileIds: [demoCurrentProfileId],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "meetup-4",
    hostId: demoCurrentProfileId,
    title: "PeakPartner Host Approval Demo",
    description: "Current user hosting a meetup with pending requests for moderation.",
    mountainName: "June Mountain",
    scheduledFor: "2026-03-25T17:00:00.000Z",
    meetingPoint: "J1 chair base",
    maxGroupSize: 5,
    skillLevel: "intermediate",
    sportType: "mixed",
    meetupType: "public_approval",
    notes: "Useful for testing host approval controls in the detail screen.",
    agePool: "adult_only",
    invitedProfileIds: [],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "meetup-5",
    hostId: "profile-host-2",
    title: "Teen Park Meetup",
    description: "Minor-only public session that should stay out of adult stranger discovery.",
    mountainName: "Big Bear",
    scheduledFor: "2026-03-19T19:00:00.000Z",
    meetingPoint: "Park map board",
    maxGroupSize: 8,
    skillLevel: "beginner",
    sportType: "snowboard",
    meetupType: "public_open",
    notes: "Public minor meetup used to validate age gating.",
    agePool: "minor_only",
    invitedProfileIds: [],
    latitude: null,
    longitude: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  }
];

export const mockParticipants: MeetupParticipant[] = [
  {
    id: "participant-1",
    meetupId: "meetup-1",
    profileId: "profile-host-1",
    role: "host",
    joinedAt: now
  },
  {
    id: "participant-2",
    meetupId: "meetup-1",
    profileId: "profile-guest-1",
    role: "participant",
    joinedAt: now
  },
  {
    id: "participant-3",
    meetupId: "meetup-2",
    profileId: "profile-host-1",
    role: "host",
    joinedAt: now
  },
  {
    id: "participant-4",
    meetupId: "meetup-3",
    profileId: "profile-host-2",
    role: "host",
    joinedAt: now
  },
  {
    id: "participant-5",
    meetupId: "meetup-4",
    profileId: demoCurrentProfileId,
    role: "host",
    joinedAt: now
  },
  {
    id: "participant-6",
    meetupId: "meetup-4",
    profileId: "profile-guest-1",
    role: "participant",
    joinedAt: now
  },
  {
    id: "participant-7",
    meetupId: "meetup-5",
    profileId: "profile-host-2",
    role: "host",
    joinedAt: now
  }
];

export const mockJoinRequests: MeetupJoinRequest[] = [
  {
    id: "request-1",
    meetupId: "meetup-4",
    profileId: "profile-host-1",
    message: "I can bring the group from Mammoth after our morning laps.",
    status: "pending",
    createdAt: now
  },
  {
    id: "request-2",
    meetupId: "meetup-4",
    profileId: "profile-guest-2",
    message: "Would love to join if the age policy allows private coordination.",
    status: "pending",
    createdAt: now
  }
];

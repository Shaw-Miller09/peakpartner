import type { PropsWithChildren } from "react";
import { createContext, useState } from "react";

import type { CreateMeetupInput, Meetup, MeetupFilters } from "@/models/meetup";
import { createHostParticipant, createInitialFilters, createJoinParticipant, createJoinRequest, createMeetupFromInput } from "@/services/meetups/meetupLogic";
import {
  demoCurrentProfileId,
  mockConnections,
  mockJoinRequests,
  mockMeetups,
  mockParticipants,
  mockProfiles
} from "@/services/meetups/mockData";
import { useAuth } from "@/hooks/useAuth";

type MeetupContextValue = {
  currentProfileId: string;
  profiles: typeof mockProfiles;
  connections: typeof mockConnections;
  meetups: Meetup[];
  participants: typeof mockParticipants;
  joinRequests: typeof mockJoinRequests;
  defaultFilters: MeetupFilters;
  createMeetup: (input: CreateMeetupInput) => Meetup;
  joinMeetup: (meetupId: string) => void;
  requestJoin: (meetupId: string) => void;
  approveRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
};

export const MeetupContext = createContext<MeetupContextValue | null>(null);

export function MeetupProvider({ children }: PropsWithChildren) {
  const { session } = useAuth();
  const [profiles] = useState(mockProfiles);
  const [connections] = useState(mockConnections);
  const [meetups, setMeetups] = useState(mockMeetups);
  const [participants, setParticipants] = useState(mockParticipants);
  const [joinRequests, setJoinRequests] = useState(mockJoinRequests);

  const sessionProfileExists = session?.user.id
    ? profiles.some((profile) => profile.id === session.user.id)
    : false;
  const currentProfileId = sessionProfileExists ? (session?.user.id as string) : demoCurrentProfileId;

  const value: MeetupContextValue = {
    currentProfileId,
    profiles,
    connections,
    meetups,
    participants,
    joinRequests,
    defaultFilters: createInitialFilters(),
    createMeetup: (input) => {
      const currentProfile = profiles.find((profile) => profile.id === currentProfileId);
      if (!currentProfile) {
        throw new Error("Current profile not available.");
      }

      const meetup = createMeetupFromInput(input, currentProfile);
      setMeetups((currentValue) => [meetup, ...currentValue]);
      setParticipants((currentValue) => [...currentValue, createHostParticipant(meetup.id, currentProfile.id)]);
      return meetup;
    },
    joinMeetup: (meetupId) => {
      setParticipants((currentValue) => {
        if (
          currentValue.some(
            (participant) =>
              participant.meetupId === meetupId && participant.profileId === currentProfileId
          )
        ) {
          return currentValue;
        }

        return [...currentValue, createJoinParticipant(meetupId, currentProfileId)];
      });
    },
    requestJoin: (meetupId) => {
      setJoinRequests((currentValue) => {
        if (
          currentValue.some(
            (request) =>
              request.meetupId === meetupId &&
              request.profileId === currentProfileId &&
              request.status === "pending"
          )
        ) {
          return currentValue;
        }

        return [...currentValue, createJoinRequest(meetupId, currentProfileId)];
      });
    },
    approveRequest: (requestId) => {
      const request = joinRequests.find((item) => item.id === requestId);
      if (!request) {
        return;
      }

      setJoinRequests((currentValue) =>
        currentValue.map((item) =>
          item.id === requestId ? { ...item, status: "approved" } : item
        )
      );
      setParticipants((currentValue) => {
        if (
          currentValue.some(
            (participant) =>
              participant.meetupId === request.meetupId && participant.profileId === request.profileId
          )
        ) {
          return currentValue;
        }

        return [...currentValue, createJoinParticipant(request.meetupId, request.profileId)];
      });
    },
    declineRequest: (requestId) => {
      setJoinRequests((currentValue) =>
        currentValue.map((item) =>
          item.id === requestId ? { ...item, status: "rejected" } : item
        )
      );
    }
  };

  return <MeetupContext.Provider value={value}>{children}</MeetupContext.Provider>;
}

import { useMeetups } from "@/hooks/useMeetups";
import { buildMeetupDetailView } from "@/services/meetups/meetupLogic";

export function useMeetupDetail(meetupId: string) {
  const meetupStore = useMeetups();
  const currentProfile = meetupStore.profiles.find(
    (profile) => profile.id === meetupStore.currentProfileId
  );

  if (!currentProfile) {
    throw new Error("Current profile not found.");
  }

  const detail = buildMeetupDetailView(
    {
      profiles: meetupStore.profiles,
      connections: meetupStore.connections,
      meetups: meetupStore.meetups,
      participants: meetupStore.participants,
      joinRequests: meetupStore.joinRequests
    },
    meetupId,
    currentProfile
  );

  return {
    ...meetupStore,
    currentProfile,
    detail
  };
}

import { useState } from "react";

import { useMeetups } from "@/hooks/useMeetups";
import type { MeetupFilters } from "@/models/meetup";
import { buildMeetupCardViews } from "@/services/meetups/meetupLogic";

export function useMeetupDiscovery() {
  const { connections, currentProfileId, defaultFilters, joinRequests, meetups, participants, profiles } =
    useMeetups();
  const [filters, setFilters] = useState<MeetupFilters>(defaultFilters);

  const currentProfile = profiles.find((profile) => profile.id === currentProfileId);
  if (!currentProfile) {
    throw new Error("Current profile not found.");
  }

  const items = buildMeetupCardViews(
    {
      profiles,
      connections,
      meetups,
      participants,
      joinRequests
    },
    currentProfile,
    filters
  );

  return {
    filters,
    setFilters,
    items
  };
}

import { router } from "expo-router";
import { Text } from "react-native";

import { Screen } from "@/components/common/Screen";
import { MeetupForm } from "@/components/meetups/MeetupForm";
import { useMeetups } from "@/hooks/useMeetups";

export default function CreateMeetupScreen() {
  const { createMeetup, currentProfileId, profiles } = useMeetups();
  const currentProfile = profiles.find((profile) => profile.id === currentProfileId);

  if (!currentProfile) {
    return (
      <Screen title="Create meetup" subtitle="Current profile is unavailable.">
        <Text>Unable to load the active rider profile.</Text>
      </Screen>
    );
  }

  return (
    <Screen
      title="Create meetup"
      subtitle="Set the riding plan, visibility, and age-safe discovery rules. Public meetups stay inside your age pool; private ones can be shared across connections."
    >
      <MeetupForm
        currentAgeGroup={currentProfile.ageGroup}
        onSubmit={(input) => {
          const meetup = createMeetup(input);
          router.replace({
            pathname: "/meetups/[meetupId]",
            params: { meetupId: meetup.id }
          });
        }}
      />
    </Screen>
  );
}

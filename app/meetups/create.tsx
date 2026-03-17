import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function CreateMeetupScreen() {
  return (
    <Screen
      title="Create meetup"
      subtitle="This modal route is the shell for meetup title, mountain, time, rider filters, and join policy."
    >
      <PlaceholderCard
        heading="Meetup composer"
        body="Bind these inputs to the `meetups` and `meetup_join_requests` tables when the feature is built."
      />
    </Screen>
  );
}

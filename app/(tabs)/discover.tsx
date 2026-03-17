import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function DiscoveryScreen() {
  return (
    <Screen
      title="Meetup discovery"
      subtitle="This screen will eventually combine nearby athletes, open meetups, and connection recommendations."
    >
      <PlaceholderCard
        heading="Discovery queue"
        body="Add filters for mountain, skill level, sport type, and availability windows."
      />
      <PlaceholderCard
        heading="Map placeholder"
        body="Route this to a map-based discovery experience once the location layer is implemented."
      />
    </Screen>
  );
}

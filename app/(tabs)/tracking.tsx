import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function TrackingScreen() {
  return (
    <Screen
      title="GPS tracking"
      subtitle="Tracked sessions and route points are modeled in SQL already; this placeholder is the UI entry point."
    >
      <PlaceholderCard
        heading="Session recorder"
        body="Track distance, vertical, speed, and route geometry per ride session."
      />
    </Screen>
  );
}

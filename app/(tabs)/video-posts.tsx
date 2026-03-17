import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function VideoPostsScreen() {
  return (
    <Screen
      title="Video posts"
      subtitle="Short-form clips, post-session highlights, and mountain conditions can be published from here."
    >
      <PlaceholderCard
        heading="Video feed"
        body="Use Supabase Storage plus a moderation workflow when this is implemented for real."
      />
    </Screen>
  );
}

import { PlaceholderCard } from "@/components/common/PlaceholderCard";
import { Screen } from "@/components/common/Screen";

export default function ChatScreen() {
  return (
    <Screen
      title="Chat"
      subtitle="Direct messages and meetup-specific group threads can share the same messaging primitives."
    >
      <PlaceholderCard
        heading="Conversation list"
        body="Render recent conversations, unread counts, and meetup-linked threads."
      />
    </Screen>
  );
}

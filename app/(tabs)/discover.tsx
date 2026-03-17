import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { MeetupCard } from "@/components/meetups/MeetupCard";
import { MeetupFiltersPanel } from "@/components/meetups/MeetupFiltersPanel";
import { useMeetupDiscovery } from "@/hooks/useMeetupDiscovery";

export default function DiscoveryScreen() {
  const { filters, items, setFilters } = useMeetupDiscovery();

  return (
    <Screen
      title="Meetup discovery"
      subtitle="Browse active meetups with age-safe stranger discovery, connection-aware private access, and host approval workflows."
    >
      <MeetupFiltersPanel filters={filters} onChange={setFilters} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available meetups</Text>
        <Link href="/meetups/create" asChild>
          <Pressable style={styles.createButton}>
            <Text style={styles.createButtonLabel}>Create</Text>
          </Pressable>
        </Link>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No meetups match these filters</Text>
          <Text style={styles.emptyBody}>
            Try broadening the mountain, date, or rider preferences. Public discovery is also age-gated, so some stranger meetups are intentionally hidden.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <MeetupCard item={item} key={item.meetup.id} />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14304D"
  },
  createButton: {
    backgroundColor: "#124E78",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  createButtonLabel: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  list: {
    gap: 14
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 22,
    padding: 22,
    gap: 10
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#14304D"
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B657D"
  }
});

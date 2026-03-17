import { StyleSheet, TextInput, View } from "react-native";

import { FormField } from "@/components/common/FormField";
import { PillSelector } from "@/components/common/PillSelector";
import type { MeetupFilters, MeetupSkillLevel, MeetupSportType, MeetupType } from "@/models/meetup";

type MeetupFiltersPanelProps = {
  filters: MeetupFilters;
  onChange: (filters: MeetupFilters) => void;
};

const skillOptions: { label: string; value: MeetupSkillLevel | "all" }[] = [
  { label: "All skills", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" }
];

const meetupTypeOptions: { label: string; value: MeetupType | "all" }[] = [
  { label: "All types", value: "all" },
  { label: "Public Open", value: "public_open" },
  { label: "Approval", value: "public_approval" },
  { label: "Private", value: "private" }
];

const sportTypeOptions: { label: string; value: MeetupSportType | "all" }[] = [
  { label: "All sports", value: "all" },
  { label: "Ski", value: "ski" },
  { label: "Snowboard", value: "snowboard" },
  { label: "Mixed", value: "mixed" }
];

export function MeetupFiltersPanel({ filters, onChange }: MeetupFiltersPanelProps) {
  return (
    <View style={styles.panel}>
      <FormField label="Mountain">
        <TextInput
          onChangeText={(mountain) => onChange({ ...filters, mountain })}
          placeholder="Search mountain"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={filters.mountain}
        />
      </FormField>

      <FormField label="Date" helperText="Use YYYY-MM-DD for an exact date filter.">
        <TextInput
          onChangeText={(date) => onChange({ ...filters, date })}
          placeholder="2026-03-21"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={filters.date}
        />
      </FormField>

      <FormField label="Skill level">
        <PillSelector
          onChange={(skillLevel) => onChange({ ...filters, skillLevel })}
          options={skillOptions}
          selectedValue={filters.skillLevel}
        />
      </FormField>

      <FormField label="Meetup type">
        <PillSelector
          onChange={(meetupType) => onChange({ ...filters, meetupType })}
          options={meetupTypeOptions}
          selectedValue={filters.meetupType}
        />
      </FormField>

      <FormField label="Sport type">
        <PillSelector
          onChange={(sportType) => onChange({ ...filters, sportType })}
          options={sportTypeOptions}
          selectedValue={filters.sportType}
        />
      </FormField>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 22,
    padding: 16,
    gap: 16
  },
  input: {
    backgroundColor: "#F7FAFD",
    borderWidth: 1,
    borderColor: "#D6E3EE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#10233C"
  }
});

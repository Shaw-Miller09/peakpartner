import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { FormField } from "@/components/common/FormField";
import { PillSelector } from "@/components/common/PillSelector";
import type { CreateMeetupInput, MeetupSkillLevel, MeetupSportType, MeetupType } from "@/models/meetup";
import type { AgeGroup } from "@/models/profile";
import { getAgePoolForMeetupType } from "@/models/meetup";

type MeetupFormProps = {
  currentAgeGroup: AgeGroup;
  onSubmit: (input: CreateMeetupInput) => void;
};

const sportOptions: { label: string; value: MeetupSportType }[] = [
  { label: "Ski", value: "ski" },
  { label: "Snowboard", value: "snowboard" },
  { label: "Mixed", value: "mixed" }
];

const skillOptions: { label: string; value: MeetupSkillLevel }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" }
];

const meetupTypeOptions: { label: string; value: MeetupType }[] = [
  { label: "Public Open", value: "public_open" },
  { label: "Approval", value: "public_approval" },
  { label: "Private", value: "private" }
];

export function MeetupForm({ currentAgeGroup, onSubmit }: MeetupFormProps) {
  const [title, setTitle] = useState("");
  const [sportType, setSportType] = useState<MeetupSportType>("mixed");
  const [mountainName, setMountainName] = useState("");
  const [date, setDate] = useState("2026-03-28");
  const [startTime, setStartTime] = useState("08:30");
  const [skillLevel, setSkillLevel] = useState<MeetupSkillLevel>("intermediate");
  const [meetupType, setMeetupType] = useState<MeetupType>("public_open");
  const [maxGroupSize, setMaxGroupSize] = useState("6");
  const [notes, setNotes] = useState("");

  const agePool = getAgePoolForMeetupType(meetupType, currentAgeGroup);

  const handleSubmit = () => {
    if (!title.trim() || !mountainName.trim() || !date.trim() || !startTime.trim()) {
      Alert.alert("Missing information", "Fill in the title, mountain, date, and start time.");
      return;
    }

    const parsedGroupSize = Number(maxGroupSize);
    if (!Number.isFinite(parsedGroupSize) || parsedGroupSize < 2) {
      Alert.alert("Invalid group size", "Max group size must be at least 2 riders.");
      return;
    }

    onSubmit({
      title,
      sportType,
      mountainName,
      date,
      startTime,
      skillLevel,
      meetupType,
      maxGroupSize: parsedGroupSize,
      notes
    });
  };

  return (
    <View style={styles.container}>
      <FormField label="Title">
        <TextInput
          onChangeText={setTitle}
          placeholder="Morning groomer laps"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={title}
        />
      </FormField>

      <FormField label="Sport type">
        <PillSelector onChange={setSportType} options={sportOptions} selectedValue={sportType} />
      </FormField>

      <FormField label="Mountain">
        <TextInput
          onChangeText={setMountainName}
          placeholder="Mammoth Mountain"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={mountainName}
        />
      </FormField>

      <View style={styles.twoUp}>
        <View style={styles.flexItem}>
          <FormField label="Date" helperText="YYYY-MM-DD">
            <TextInput
              onChangeText={setDate}
              placeholder="2026-03-28"
              placeholderTextColor="#7A8EA2"
              style={styles.input}
              value={date}
            />
          </FormField>
        </View>
        <View style={styles.flexItem}>
          <FormField label="Start time" helperText="24-hour HH:MM">
            <TextInput
              onChangeText={setStartTime}
              placeholder="08:30"
              placeholderTextColor="#7A8EA2"
              style={styles.input}
              value={startTime}
            />
          </FormField>
        </View>
      </View>

      <FormField label="Skill level">
        <PillSelector onChange={setSkillLevel} options={skillOptions} selectedValue={skillLevel} />
      </FormField>

      <FormField label="Meetup type">
        <PillSelector onChange={setMeetupType} options={meetupTypeOptions} selectedValue={meetupType} />
      </FormField>

      <FormField
        label="Age pool logic"
        helperText={`${agePool.label}: ${agePool.detail}`}
      >
        <View style={styles.agePoolCard}>
          <Text style={styles.agePoolLabel}>{agePool.label}</Text>
          <Text style={styles.agePoolDetail}>{agePool.detail}</Text>
        </View>
      </FormField>

      <FormField label="Max group size">
        <TextInput
          keyboardType="number-pad"
          onChangeText={setMaxGroupSize}
          placeholder="6"
          placeholderTextColor="#7A8EA2"
          style={styles.input}
          value={maxGroupSize}
        />
      </FormField>

      <FormField label="Notes">
        <TextInput
          multiline
          onChangeText={setNotes}
          placeholder="Pace, meetup goals, parking notes, or anything riders should know."
          placeholderTextColor="#7A8EA2"
          style={[styles.input, styles.multiline]}
          textAlignVertical="top"
          value={notes}
        />
      </FormField>

      <Pressable onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitLabel}>Create meetup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18
  },
  twoUp: {
    flexDirection: "row",
    gap: 12
  },
  flexItem: {
    flex: 1
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E3EE",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#10233C"
  },
  multiline: {
    minHeight: 110
  },
  agePoolCard: {
    backgroundColor: "#EEF5FB",
    borderRadius: 16,
    padding: 14,
    gap: 6
  },
  agePoolLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#124E78"
  },
  agePoolDetail: {
    fontSize: 14,
    lineHeight: 20,
    color: "#35566F"
  },
  submitButton: {
    backgroundColor: "#124E78",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 15
  },
  submitLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  }
});

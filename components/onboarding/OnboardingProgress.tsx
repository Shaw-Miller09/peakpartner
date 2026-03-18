import { StyleSheet, View } from "react-native";

type OnboardingProgressProps = {
  step: number;
  total: number;
};

export function OnboardingProgress({ step, total }: OnboardingProgressProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={StyleSheet.compose(styles.segment, index <= step ? styles.segmentActive : undefined)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8
  },
  segment: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#D9E6F2"
  },
  segmentActive: {
    backgroundColor: "#124E78"
  }
});

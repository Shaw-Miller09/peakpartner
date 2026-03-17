import { Pressable, StyleSheet, Text, View } from "react-native";

type Option<T extends string> = {
  label: string;
  value: T;
};

type PillSelectorProps<T extends string> = {
  options: Option<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
};

export function PillSelector<T extends string>({
  onChange,
  options,
  selectedValue
}: PillSelectorProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option.value === selectedValue;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.pill, selected ? styles.pillSelected : undefined]}
          >
            <Text style={[styles.label, selected ? styles.labelSelected : undefined]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  pill: {
    borderWidth: 1,
    borderColor: "#C8D8E6",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF"
  },
  pillSelected: {
    backgroundColor: "#124E78",
    borderColor: "#124E78"
  },
  label: {
    color: "#24506F",
    fontSize: 14,
    fontWeight: "500"
  },
  labelSelected: {
    color: "#FFFFFF"
  }
});

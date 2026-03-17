import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

type FormFieldProps = PropsWithChildren<{
  label: string;
  helperText?: string;
}>;

export function FormField({ children, helperText, label }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#14304D"
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#678098"
  }
});

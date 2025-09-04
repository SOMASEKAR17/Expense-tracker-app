import React from "react";
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from "react-native";

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export default function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor="#9ca3af"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

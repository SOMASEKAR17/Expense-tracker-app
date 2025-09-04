import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export default function Button({ title, style, textStyle, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.85}
      style={[styles.button, style]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#059669", // Default green
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

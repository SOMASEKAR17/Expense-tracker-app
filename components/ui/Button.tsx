import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function Button({ title, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      {...props}
      className="w-full bg-primary-600 rounded-xl px-6 py-4 items-center justify-center shadow-lg shadow-primary-500/25 active:scale-95 transition-all duration-200"
      activeOpacity={0.8}
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </TouchableOpacity>
  );
}
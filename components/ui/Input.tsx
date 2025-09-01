import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base bg-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
      placeholderTextColor="#9ca3af"
    />
  );
}
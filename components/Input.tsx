import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  className?: string;
  containerClassName?: string;
}

export const Input = ({
  label,
  className = "",
  containerClassName = "",
  ...props
}: InputProps) => {
  return (
    <View className={`${containerClassName}`}>
      <Text className="text-[10px] font-black text-muted dark:text-dark-muted mb-3 uppercase tracking-[2px] ml-1">
        {label}
      </Text>
      <TextInput
        className={`bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-[24px] p-5 text-base text-primary dark:text-dark-primary font-bold ${className}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  );
};

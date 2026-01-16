import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface ButtonProps {
  onPress: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export const Button = ({
  onPress,
  label,
  loading,
  disabled,
  icon: Icon,
  variant = "primary",
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "h-16 rounded-3xl items-center justify-center flex-row px-6";
  const variantStyles = {
    primary: "bg-primary shadow-xl shadow-slate-900/10",
    secondary: "bg-secondary dark:bg-dark-secondary",
    outline: "bg-transparent border border-border dark:border-dark-border",
  };

  const textStyles = {
    primary: "text-primary-foreground dark:text-dark-secondary",
    secondary: "text-primary dark:text-dark-primary",
    outline: "text-primary dark:text-dark-primary",
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled || loading ? "opacity-50" : ""
      } ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "white" : "#111827"}
        />
      ) : (
        <>
          {Icon && (
            <View className="mr-3">
              <Icon
                size={20}
                color={
                  variant === "primary"
                    ? "#ffffff"
                    : isDarkVariant(variant)
                    ? "#ffffff"
                    : "#111827"
                }
                strokeWidth={1.5}
              />
            </View>
          )}
          <Text
            className={`${textStyles[variant]} font-black uppercase tracking-[3px] text-xs`}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const isDarkVariant = (variant: string) => {
  // This is a helper for icon colors if needed, but for now we keep it simple
  return false;
};

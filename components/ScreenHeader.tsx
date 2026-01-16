import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const ScreenHeader = ({
  title,
  showBack = true,
  rightElement,
}: ScreenHeaderProps) => {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <View className="px-6 py-6 flex-row items-center justify-between border-b border-border dark:border-dark-border">
      <View className="flex-row items-center">
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
          >
            <ChevronLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
          </TouchableOpacity>
        )}
        <Text
          className={`text-xl font-black text-primary dark:text-dark-primary tracking-tighter ${
            showBack ? "ml-4" : ""
          }`}
        >
          {title}
        </Text>
      </View>
      {rightElement && <View>{rightElement}</View>}
    </View>
  );
};

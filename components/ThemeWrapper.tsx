import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <View
      className={`flex-1 ${mode === "dark" ? "dark bg-black" : "bg-white"}`}
    >
      {children}
    </View>
  );
}

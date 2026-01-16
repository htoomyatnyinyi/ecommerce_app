import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../services/store";
import { toggleTheme } from "../services/themeSlice";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Eye,
  Globe,
  Package,
  Sparkles,
} from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { resetOnboarding } from "../services/settingsSlice";

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const SettingItem = ({
    icon: Icon,
    label,
    value,
    onPress,
    isToggle,
    toggleValue,
    onToggle,
  }: any) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-5 bg-secondary dark:bg-dark-secondary rounded-[28px] mb-4 border border-border/50 dark:border-dark-border/50"
      onPress={onPress}
      disabled={isToggle}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-2xl items-center justify-center bg-accent dark:bg-dark-accent">
          <Icon
            size={20}
            color={isDark ? "#ffffff" : "#111827"}
            strokeWidth={1.5}
          />
        </View>
        <Text className="ml-4 text-primary dark:text-dark-primary font-bold">
          {label}
        </Text>
      </View>
      {isToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#e5e7eb", true: "#111827" }}
          thumbColor={isDark ? "#ffffff" : "#f4f3f4"}
        />
      ) : (
        <View className="flex-row items-center">
          <Text className="text-muted dark:text-dark-muted font-bold text-xs uppercase tracking-widest mr-2">
            {value}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader title="Settings" />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-6 ml-2">
          Appearance
        </Text>

        <SettingItem
          icon={isDark ? Moon : Sun}
          label="Dark Mode"
          isToggle={true}
          toggleValue={isDark}
          onToggle={() => dispatch(toggleTheme())}
        />

        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mt-8 mb-6 ml-2">
          General
        </Text>

        <SettingItem
          icon={Package}
          label="My Orders"
          onPress={() => router.push("/orders" as any)}
        />

        <SettingItem
          icon={Bell}
          label="Notifications"
          value="On"
          onPress={() => {}}
        />

        <SettingItem
          icon={Globe}
          label="Language"
          value="English"
          onPress={() => {}}
        />

        <SettingItem
          icon={Sparkles}
          label="Reset Onboarding"
          onPress={() => dispatch(resetOnboarding())}
        />

        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mt-8 mb-6 ml-2">
          Security
        </Text>

        <SettingItem icon={Lock} label="Privacy" onPress={() => {}} />

        <SettingItem
          icon={Eye}
          label="Visibility"
          value="Public"
          onPress={() => {}}
        />

        <View className="py-20 items-center">
          <Text className="text-muted dark:text-dark-muted text-[10px] font-black uppercase tracking-[4px]">
            Shopio Mobile v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

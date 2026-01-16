import React, { useState, useEffect } from "react";
import { View, SafeAreaView, StatusBar, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useAuthMeQuery } from "../services/api/authApi";
import { useUpdateProfileMutation } from "../services/api/userApi";
import { RootState } from "../services/store";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: user } = useAuthMeQuery(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [username, setUsername] = useState(user?.username || "");

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      await updateProfile({ username }).unwrap();
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.data?.message || "Failed to update profile");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Edit Profile" />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Your premium username"
          />

          <Input
            label="Email Address"
            value={user?.email || ""}
            editable={false}
            containerClassName="opacity-60"
          />

          <View className="mt-8">
            <Button
              label="Save Changes"
              onPress={handleSave}
              loading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

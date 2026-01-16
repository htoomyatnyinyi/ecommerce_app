import React, { useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { useCreateAddressMutation } from "../services/api/addressApi";
import { RootState } from "../services/store";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Home, Briefcase, MapPin } from "lucide-react-native";

export default function AddAddressScreen() {
  const router = useRouter();
  const [createAddress, { isLoading }] = useCreateAddressMutation();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [form, setForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    country: "USA",
    postalCode: "",
    isDefault: false,
  });

  const handleSave = async () => {
    if (!form.street || !form.city || !form.postalCode) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      await createAddress(form).unwrap();
      Alert.alert("Success", "Address added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.data?.error || "Failed to add address.");
    }
  };

  const labels = [
    { name: "Home", icon: Home },
    { name: "Work", icon: Briefcase },
    { name: "Other", icon: MapPin },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="New Address" />

      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-6 ml-2">
          Address Type
        </Text>

        <View className="flex-row gap-4 mb-8">
          {labels.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => setForm({ ...form, label: item.name })}
              className={`flex-1 p-4 rounded-3xl items-center border ${
                form.label === item.name
                  ? "bg-primary border-primary"
                  : "bg-secondary dark:bg-dark-secondary border-border dark:border-dark-border"
              }`}
            >
              <item.icon
                size={20}
                color={
                  form.label === item.name
                    ? "#ffffff"
                    : isDark
                    ? "#ffffff"
                    : "#111827"
                }
                strokeWidth={1.5}
              />
              <Text
                className={`text-[10px] font-black mt-2 uppercase tracking-widest ${
                  form.label === item.name
                    ? "text-white"
                    : "text-primary dark:text-dark-primary"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="gap-6">
          <Input
            label="Street Address"
            placeholder="123 Premium Lane"
            value={form.street}
            onChangeText={(text) => setForm({ ...form, street: text })}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input
                label="City"
                placeholder="Modern City"
                value={form.city}
                onChangeText={(text) => setForm({ ...form, city: text })}
              />
            </View>
            <View className="flex-1">
              <Input
                label="State / Province"
                placeholder="ST"
                value={form.state}
                onChangeText={(text) => setForm({ ...form, state: text })}
              />
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Input
                label="Postal Code"
                placeholder="12345"
                value={form.postalCode}
                onChangeText={(text) => setForm({ ...form, postalCode: text })}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Country"
                placeholder="USA"
                value={form.country}
                onChangeText={(text) => setForm({ ...form, country: text })}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between bg-accent dark:bg-dark-accent p-6 rounded-[32px] mt-2 border border-border dark:border-dark-border">
            <View>
              <Text className="text-primary dark:text-dark-primary font-bold text-sm">
                Set as Default
              </Text>
              <Text className="text-muted dark:text-dark-muted text-[10px] font-bold uppercase tracking-widest mt-1">
                Primary shipping location
              </Text>
            </View>
            <Switch
              value={form.isDefault}
              onValueChange={(val) => setForm({ ...form, isDefault: val })}
              trackColor={{ false: "#e5e7eb", true: "#111827" }}
              thumbColor={isDark ? "#ffffff" : "#ffffff"}
            />
          </View>
        </View>

        <View className="mt-12 mb-20">
          <Button
            label="Save Address"
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

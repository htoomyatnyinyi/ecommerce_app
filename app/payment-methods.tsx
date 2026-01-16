import React from "react";
import { View, Text, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";
import { CreditCard, Plus, ShieldCheck, Lock } from "lucide-react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { Button } from "../components/Button";

export default function PaymentMethodsScreen() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScreenHeader
        title="Payments"
        rightElement={
          <View className="w-10 h-10 bg-primary dark:bg-dark-primary rounded-2xl items-center justify-center shadow-lg">
            <Plus size={20} color={isDark ? "#111827" : "#ffffff"} />
          </View>
        }
      />

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-primary dark:bg-dark-secondary p-8 rounded-[40px] mb-8 shadow-2xl shadow-slate-900/20">
          <View className="flex-row justify-between items-start mb-12">
            <View>
              <Text className="text-white/50 text-[10px] font-black uppercase tracking-[3px] mb-1">
                Premium Member
              </Text>
              <Text className="text-white text-xl font-black tracking-[4px]">
                VISA
              </Text>
            </View>
            <CreditCard size={32} color="white" strokeWidth={1} />
          </View>

          <Text className="text-white text-2xl font-black tracking-[4px] mb-8">
            •••• •••• •••• 4242
          </Text>

          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-white/50 text-[10px] font-black uppercase tracking-[2px] mb-1">
                Expiry
              </Text>
              <Text className="text-white font-black">12/26</Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-black uppercase tracking-widest">
                Active
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-6 ml-2">
          Security Info
        </Text>

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-6 border border-border dark:border-dark-border">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center">
              <ShieldCheck
                size={18}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
            </View>
            <Text className="ml-3 text-primary dark:text-dark-primary font-bold text-sm">
              Encrypted Storage
            </Text>
          </View>
          <Text className="text-muted dark:text-dark-muted text-xs leading-5 ml-11 font-medium">
            Your payment information is stored securely following PCI compliance
            standards. We never store your full CVV.
          </Text>
        </View>

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-[32px] mb-12 border border-border dark:border-dark-border">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 items-center justify-center">
              <Lock
                size={18}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
            </View>
            <Text className="ml-3 text-primary dark:text-dark-primary font-bold text-sm">
              Transaction Protection
            </Text>
          </View>
          <Text className="text-muted dark:text-dark-muted text-xs leading-5 ml-11 font-medium">
            All transactions are verified through encrypted channels for maximum
            security.
          </Text>
        </View>

        <View className="mb-20">
          <Button
            label="Manage Saved Cards"
            variant="secondary"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

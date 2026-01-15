import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../services/store";
import {
  ChevronLeft,
  CreditCard,
  Plus,
  ShieldCheck,
  Lock,
} from "lucide-react-native";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-6 py-6 flex-row items-center justify-between border-b border-border dark:border-dark-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
          >
            <ChevronLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-black text-primary dark:text-dark-primary tracking-tighter">
            Payments
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 bg-primary dark:bg-dark-primary rounded-2xl items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Plus size={20} color={isDark ? "#000000" : "#ffffff"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Visa Card Placeholder */}
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

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-3xl mb-8">
          <View className="flex-row items-center mb-4">
            <ShieldCheck
              size={20}
              color={isDark ? "#ffffff" : "#111827"}
              strokeWidth={1.5}
            />
            <Text className="ml-3 text-primary dark:text-dark-primary font-bold text-sm">
              Encrypted Storage
            </Text>
          </View>
          <Text className="text-muted dark:text-dark-muted text-xs leading-5 ml-8 italic">
            Your payment information is stored securely following PCI compliance
            standards. We never store your full CVV.
          </Text>
        </View>

        <View className="bg-accent dark:bg-dark-accent p-6 rounded-3xl mb-12">
          <View className="flex-row items-center mb-4">
            <Lock
              size={20}
              color={isDark ? "#ffffff" : "#111827"}
              strokeWidth={1.5}
            />
            <Text className="ml-3 text-primary dark:text-dark-primary font-bold text-sm">
              Two-Factor Authentication
            </Text>
          </View>
          <Text className="text-muted dark:text-dark-muted text-xs leading-5 ml-8 italic">
            All transactions are verified through your mobile device for
            additional security.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-secondary dark:bg-dark-secondary py-5 rounded-[24px] items-center border border-border dark:border-dark-border mb-20"
          activeOpacity={0.8}
        >
          <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-[3px] text-[10px]">
            Manage Saved Cards
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

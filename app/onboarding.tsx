import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react-native";
import { completeOnboarding } from "../services/settingsSlice";
import { RootState } from "../services/store";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Premium\nCollections",
    description:
      "Curated selection of high-end essentials designed for the modern lifestyle.",
    icon: ShoppingBag,
    color: "#111827",
  },
  {
    id: "2",
    title: "Secure\nPayments",
    description:
      "Experience absolute peace of mind with our military-grade encrypted checkout.",
    icon: ShieldCheck,
    color: "#111827",
  },
  {
    id: "3",
    title: "Elevated\nLiving",
    description:
      "Join our exclusive community and transform your daily aesthetic experience.",
    icon: Sparkles,
    color: "#111827",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    dispatch(completeOnboarding());
    router.replace("/signin");
  };

  const renderItem = ({ item }: { item: (typeof SLIDES)[0] }) => (
    <View style={{ width }} className="px-10 justify-center items-center">
      <View className="w-64 h-64 bg-secondary dark:bg-dark-secondary rounded-[60px] items-center justify-center mb-16 shadow-2xl shadow-slate-900/10 rotate-12">
        <View className="-rotate-12">
          <item.icon
            size={80}
            color={isDark ? "#ffffff" : "#111827"}
            strokeWidth={1}
          />
        </View>
      </View>

      <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[6px] mb-4 text-center">
        Discovery 0{item.id}
      </Text>

      <Text className="text-5xl font-black text-primary dark:text-dark-primary text-center tracking-tighter leading-[54px] mb-6">
        {item.title}
      </Text>

      <Text className="text-muted dark:text-dark-muted text-center text-lg font-bold leading-7 px-4">
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row justify-between items-center px-10 py-6">
        <Text className="text-xl font-black text-primary dark:text-dark-primary tracking-tighter">
          SHOPIO
        </Text>
        <TouchableOpacity onPress={handleFinish}>
          <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px]">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <View className="px-10 pb-16">
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2">
            {SLIDES.map((_, i) => {
              const dotWidth = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [8, 24, 8],
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i}
                  style={{ width: dotWidth, opacity }}
                  className="h-2 bg-primary dark:bg-dark-primary rounded-full"
                />
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.9}
            className="w-20 h-20 bg-primary dark:bg-dark-primary rounded-full items-center justify-center shadow-2xl shadow-slate-900/20"
          >
            {currentIndex === SLIDES.length - 1 ? (
              <Text className="text-white dark:text-black font-black uppercase text-[10px] tracking-widest">
                Start
              </Text>
            ) : (
              <ChevronRight
                size={24}
                color={isDark ? "#000000" : "#ffffff"}
                strokeWidth={3}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

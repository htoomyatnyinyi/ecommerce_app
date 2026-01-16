import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetProductByIdQuery } from "../../services/api/productApi";
import { useAddToCartMutation } from "../../services/api/cartApi";
import {
  ChevronLeft,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../services/store";
import { toggleWishlist } from "../../services/wishlistSlice";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { data: productData, isLoading } = useGetProductByIdQuery(id);
  const product = productData?.product || productData;
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === "dark";

  const [selectedVariant, setSelectedVariant] = React.useState<any>(null);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const router = useRouter();

  // Initialize selected variant
  React.useEffect(() => {
    if (product?.variants?.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const handleAddToCart = async () => {
    const variantToUse = selectedVariant || product?.variants?.[0];

    if (!variantToUse?.id) {
      Alert.alert("Error", "Product variant not found");
      return;
    }

    try {
      await addToCart({
        productId: id as string,
        variantId: variantToUse.id,
        quantity: 1,
      }).unwrap();
      Alert.alert("Success", "Added to bag!", [
        { text: "View Bag", onPress: () => router.push("/cart") },
        { text: "Continue Shopping" },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to add to bag");
    }
  };

  const isInWishlist = wishlistItems.some((item) => item.id === id);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <ActivityIndicator
          size="large"
          color={isDark ? "#ffffff" : "#111827"}
        />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
        <Text className="text-muted dark:text-dark-muted">
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Modern Header */}
      <View className="px-6 py-4 flex-row justify-between items-center z-10 bg-background dark:bg-dark-background">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
        >
          <ChevronLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          className="w-12 h-12 bg-secondary dark:bg-dark-secondary rounded-2xl items-center justify-center"
        >
          <ShoppingBag size={20} color={isDark ? "#ffffff" : "#111827"} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 mb-8">
          <View className="aspect-3/4 rounded-[40px] overflow-hidden bg-secondary dark:bg-dark-secondary shadow-sm">
            <Image
              source={{
                uri:
                  product.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        <View className="px-8 pb-40">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 mr-4">
              <Text className="text-[10px] font-black text-muted dark:text-dark-muted uppercase tracking-[3px] mb-2">
                {product.category?.categoryName || "Premium Collection"}
              </Text>
              <Text className="text-3xl font-black text-primary dark:text-dark-primary tracking-tighter leading-tight">
                {product.title}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-black text-primary dark:text-dark-primary tracking-tighter pt-1">
                ${selectedVariant?.price || product.variants?.[0]?.price}
              </Text>
              {selectedVariant?.sku && (
                <Text className="text-[10px] font-bold text-muted dark:text-dark-muted uppercase tracking-widest mt-1">
                  SKU: {selectedVariant.sku}
                </Text>
              )}
            </View>
          </View>

          {/* Variant Selection Section */}
          <View className="mb-8">
            <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-[2px] text-[10px] mb-4">
              Available Options
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-3"
            >
              {product.variants?.map((variant: any) => (
                <TouchableOpacity
                  key={variant.id}
                  onPress={() => setSelectedVariant(variant)}
                  className={`px-6 py-4 rounded-[24px] border-2 flex-row items-center gap-3 ${
                    selectedVariant?.id === variant.id
                      ? "border-primary bg-primary/5 dark:bg-dark-primary/5"
                      : "border-border dark:border-dark-border bg-secondary dark:bg-dark-secondary"
                  }`}
                >
                  <View
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                    className="w-5 h-5 rounded-full border border-border/20 shadow-sm"
                  />
                  <View>
                    <Text
                      className={`font-black text-xs ${
                        selectedVariant?.id === variant.id
                          ? "text-primary dark:text-dark-primary"
                          : "text-muted dark:text-dark-muted"
                      }`}
                    >
                      {variant.color} / {variant.size}
                    </Text>
                    <Text className="text-[9px] font-bold text-muted dark:text-dark-muted uppercase tracking-tighter mt-0.5">
                      {variant.stock || 0} in stock
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Features Grid */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-secondary dark:bg-dark-secondary p-4 rounded-3xl">
              <ShieldCheck
                size={20}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
              <Text className="text-[10px] text-muted dark:text-dark-muted font-black mt-2 uppercase tracking-widest">
                Warranty
              </Text>
            </View>
            <View className="flex-1 bg-secondary dark:bg-dark-secondary p-4 rounded-3xl">
              <Truck
                size={20}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
              <Text className="text-[10px] text-muted dark:text-dark-muted font-black mt-2 uppercase tracking-widest">
                Express
              </Text>
            </View>
            <View className="flex-1 bg-accent dark:bg-dark-accent p-4 rounded-3xl">
              <Star
                size={20}
                color={isDark ? "#ffffff" : "#111827"}
                strokeWidth={1.5}
              />
              <Text className="text-[10px] text-muted dark:text-dark-muted font-black mt-2 uppercase tracking-widest">
                4.8 Rating
              </Text>
            </View>
          </View>

          <Text className="text-primary dark:text-dark-primary font-black uppercase tracking-[2px] text-[10px] mb-4">
            The Story
          </Text>
          <Text className="text-muted dark:text-dark-muted leading-7 text-sm mb-10 font-medium">
            {product.description ||
              "Experience uncompromising quality with this premium product. Designed for excellence and built to last, it's the perfect addition to your high-end lifestyle."}
          </Text>
        </View>
      </ScrollView>

      {/* High-End Floating Action Bar */}
      <View className="absolute bottom-10 left-8 right-8 flex-row gap-4">
        <TouchableOpacity
          onPress={() =>
            dispatch(
              toggleWishlist({
                id: product.id.toString(),
                title: product.title,
                price: product.variants?.[0]?.price || 0,
                image: product.images?.[0]?.url || "",
                category: product.category?.categoryName || "Essentials",
              })
            )
          }
          className={`w-16 h-16 ${
            isInWishlist ? "bg-primary" : "bg-secondary dark:bg-dark-secondary"
          } rounded-3xl items-center justify-center border border-border dark:border-dark-border shadow-sm`}
        >
          <Heart
            size={24}
            color={isInWishlist ? "#ffffff" : isDark ? "#ffffff" : "#111827"}
            fill={isInWishlist ? "#ffffff" : "transparent"}
            strokeWidth={1.5}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 bg-primary h-16 rounded-3xl items-center justify-center shadow-xl shadow-slate-900/10 ${
            isAdding || (selectedVariant && selectedVariant.stock === 0)
              ? "opacity-70"
              : ""
          }`}
          onPress={handleAddToCart}
          disabled={
            isAdding ||
            (selectedVariant &&
              (selectedVariant.stock === 0 || selectedVariant.stock === null))
          }
          activeOpacity={0.9}
        >
          <Text className="text-primary-foreground font-black uppercase tracking-[3px] text-xs">
            {isAdding
              ? "Adding..."
              : selectedVariant &&
                (selectedVariant.stock === 0 || selectedVariant.stock === null)
              ? "Out of Stock"
              : "Add to Bag"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

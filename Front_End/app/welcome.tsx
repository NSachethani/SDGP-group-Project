import { View, Text, TouchableOpacity, Image } from "react-native";
import CustomButton from "@/components/CustomButton";
import React, { useRef, useState } from "react";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { onboarding } from "@/constants";

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  return (
    <View className="flex h-full justify-between items-center">
      <TouchableOpacity
        onPress={() => {
          router.replace("/sign-in");
        }}
        className="w-full flex justify-end items-end p-5 font-bold text-xl"
      >
        <Text className="font-bold text-lg" style={{ color: "#7f7d80" }}>
          Skip
        </Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] bg-[#E2E8F0] mx-1 rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] bg-[#0286FF] mx-1 rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10 ">
              <Text className="text-black text-3xl mx-10 text-center font-ztgatha">
                {item.title}
              </Text>
            </View>
            <Text className="text-[#828585] font-rubik text-lg text-center mx-8 mt-5">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        onPress={() =>
          isLastSlide
            ? router.replace("/sign-in")
            : swiperRef.current?.scrollBy(1)
        }
        className="w-11/12 mt-10 mb-5"
      />
    </View>
  );
};

export default Onboarding;

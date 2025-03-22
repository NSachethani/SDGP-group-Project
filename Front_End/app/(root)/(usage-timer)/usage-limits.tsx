import { View, Text, ImageBackground,BackHandler, } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const UsageLimits = () => {

// Back button to go to home screen (Hardware back button)
useEffect(() => {
  const backAction = () => {
    router.replace("/(root)/(tabs)/home");
    return true;
  };
  BackHandler.addEventListener("hardwareBackPress", backAction);
  return () =>
    BackHandler.removeEventListener("hardwareBackPress", backAction);
}, []);

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1">
          <Text className="text-white font-bold">
            Start Cording in here and don't remove safeareaview and
            imagebackground
          </Text>
          <View className="flex-1 items-center justify-center">
            <Text className="text-xl mb-6">Usage Limits</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default UsageLimits;

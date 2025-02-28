import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const UsageLimits = () => {
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

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";

const settings = () => {
  const { signOut } = useClerk(); // useClerk returns the clerk instance

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in"); // redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handletimer = async () => {
    try {
      await signOut();
      router.replace("/(root)/(usage-timer)/usage-limits"); // redirect to login page
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl mb-6">Settings</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-4 py-2 rounded-full"
      >
        <Text className="text-white font-bold">Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handletimer}
        className="bg-red-500 px-4 py-2 rounded-full mt-8"
      >
        <Text className="text-white font-bold">App Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default settings;

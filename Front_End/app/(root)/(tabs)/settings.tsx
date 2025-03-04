import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      if (user?.id) {
        // Clear user progress
        await AsyncStorage.removeItem(`userProgress_${user.id}`);
        // Sign out
        await signOut();
        // Redirect to login page
        router.replace("/(auth)/sign-in");
      } else {
        Alert.alert("Error", "Unable to find user information");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out properly");
    }
  };

  const handleTimer = async () => {
    try {
      router.replace("/(root)/(usage-timer)/usage-limits");
    } catch (error) {
      console.error("Error navigating to timer:", error);
      Alert.alert("Error", "Failed to open timer settings");
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
        onPress={handleTimer}
        className="bg-red-500 px-4 py-2 rounded-full mt-8"
      >
        <Text className="text-white font-bold">App Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
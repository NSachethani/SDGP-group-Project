import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import icon from "@/constants/icon";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";

const settings = () => {
  const { signOut } = useClerk(); // useClerk returns the clerk instance
  const { user } = useUser();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      // Clear user progress
      if (user) {
        await AsyncStorage.removeItem(`userProgress_${user.id}`);
      }
      // Remove session token from storage
      await AsyncStorage.removeItem("sessionToken");

      router.replace("/(auth)/sign-in"); // redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  const handleBack = async () => {
    try {
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  // Function to handle changing the profile picture
  const handleChangeProfilePic = async () => {
    if (!user) return; // Ensure the user is logged in
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return; // Exit if permission is not granted

    // Launch the image picker to select an image
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Allow editing the selected image
      base64: true, // Return the image as a base64 string
    });

    // If the user selects an image, set it as the selected image URI
    if (!result.canceled) {
      setSelectedImageUri("data:image/jpeg;base64," + result.assets[0].base64);
      setPreviewVisible(true); // Show the preview modal
    }
  };

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView>
            <View className="bg-white/60 rounded-lg p-4 flex justify-center m-5">
              <View className="flex flex-row justify-between">
                <TouchableOpacity onPress={handleBack}>
                  <Image source={icon.backArrow2} className="w-8 h-8 mt-1" />
                </TouchableOpacity>
                <Text className="text-center text-2xl font-semibold text-[#7769B7]">
                  Settings
                </Text>
                <TouchableOpacity onPress={handleLogout}>
                  <Image source={icon.logout} className="w-10 h-10" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex items-center justify-center my-5">
              <TouchableOpacity onPress={handleChangeProfilePic}>
                <Image
                  source={{
                    uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  style={{ width: 110, height: 110, borderRadius: 110 / 2 }}
                  className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                />
              </TouchableOpacity>
            </View>
            <View className="flex flex-col bg-white/60 rounded-lg p-4 m-5">
              <Text className="text-center text-2xl font-ztgatha mb-2">
                Profile Info
              </Text>
              <View className="bg-white/60 rounded-lg mb-2">
                <Text className="text-lg p-1">
                  <Text className="font-ztgatha">First Name:{"  "}</Text>{" "}
                  {user?.firstName || "Not Found"}
                </Text>
              </View>
              <View className="bg-white/60 rounded-lg mb-2">
                <Text className="text-lg p-1">
                  <Text className="font-ztgatha">Last Name:{"  "}</Text>
                  {user?.lastName || "Not Found"}
                </Text>
              </View>
              <View className="bg-white/60 rounded-lg mb-2">
                <Text className="text-lg p-1">
                  <Text className="font-ztgatha">Email:{"  "}</Text>
                  {user?.primaryEmailAddress?.emailAddress || "Not Found"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      <Modal visible={previewVisible} transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-[90%]">
            {selectedImageUri && (
              <Image
                source={{ uri: selectedImageUri }}
                style={{ width: "100%", height: 200, resizeMode: "contain" }}
              />
            )}
            <TouchableOpacity
              onPress={async () => {
                if (!user || !selectedImageUri) return;
                try {
                  await user.setProfileImage({ file: selectedImageUri });
                  await user.update({});
                  console.log("Profile image updated successfully");
                  setPreviewVisible(false);
                  setSelectedImageUri(null);
                } catch (error) {
                  console.log("Error updating image:", error);
                }
              }}
              className="bg-[#7769B7] rounded-md p-3 mt-4"
            >
              <Text className="text-white text-center font-bold">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPreviewVisible(false);
                setSelectedImageUri(null);
              }}
              className="bg-gray-400 rounded-md p-3 mt-2"
            >
              <Text className="text-white text-center font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default settings;

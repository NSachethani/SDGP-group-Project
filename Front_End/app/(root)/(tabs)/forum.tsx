import {
  View,
  Text,
  BackHandler,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import icon from "@/constants/icon";
import { useUser } from "@clerk/clerk-expo";

// Define the main forum component
const forum = () => {
  // State to manage the visibility of the information modal
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Function to handle the back button press and navigate to the home page
  const handleBack = async () => {
    try {
      router.replace("/(root)/(tabs)/home"); // Redirect to the home page
    } catch (error) {
      console.error("Error loading:", error); // Log any errors
    }
  };

  // Destructure the user object from the useUser hook
  const { user } = useUser();

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView>
            {/* Header section with back button, title, and info button */}
            <View className="bg-white/60 rounded-lg p-4 flex justify-center m-5">
              <View className="flex flex-row justify-between">
              {/* Back button to navigate to the previous screen */}
              <TouchableOpacity onPress={handleBack}>
                <Image source={icon.backArrow2} className="w-8 h-8 mt-1" />
              </TouchableOpacity>
              {/* Title of the forum */}
              <Text className="text-center text-2xl font-semibold text-[#7769B7]">
                Community Forum
              </Text>
              {/* Info button to open the modal with forum rules */}
              <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                <Image source={icon.info} className="w-10 h-10" />
              </TouchableOpacity>
              </View>
            </View>

            {/* Profile Status Section */}
            <View className="bg-white/60 rounded-lg ml-5 mr-5 mb-3">
              {/* Title for Profile Status */}
              <Text className="ml-4 text-2xl font-ztgatha mt-1">
              Profile Status:
              </Text>
              <View className="flex flex-row justify-between p-4">
              {/* User Information Section */}
              <View>
                {/* Display Forum Name */}
                <Text className="font-rubik-light text-lg">
                <Text className="font-rubik-medium">
                  &#8226; Forum Name:{" "}
                </Text>
                {user?.firstName || "Not Found"}{" "}
                {user?.lastName || "Not Found"}
                </Text>
                {/* Display Warns Count */}
                <Text className="font-ztgatha text-lg">
                <Text className="font-rubik-medium">&#8226; Warns: </Text>0
                </Text>
              </View>
              {/* Vertical Divider */}
              <View style={styles.verticalLine}></View>
              {/* User Profile Picture Section */}
              <View className="flex justify-center items-center m-2">
                <Image
                source={{
                  uri:
                  user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                }}
                style={{ width: 50, height: 50, borderRadius: 110 / 2 }}
                className="rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                />
              </View>
              </View>
            </View>
            <View className=" ml-5">
              <Text className="text-2xl font-ztgatha mt-1">
                Forum Channels:
              </Text>
            </View>
            {/* Mindful Living Forum Channel */}
            <View>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Mindful-Living"); // Navigate to the Mindful Living page
              }}
              >
              <View className="flex flex-col bg-white/70 rounded-lg p-4 m-5">
                <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-semibold">
                  Mindful Living
                </Text>
                {/* Button to open a modal or perform additional actions */}
                <TouchableOpacity
                  onPress={() => {
                  router.replace({
                    pathname: "/Mindful-Living",
                    params: { showModal: "true" }, // Pass parameters to the route
                  });
                  }}
                >
                  <Image source={icon.add} className="w-8 h-8 mt-1"></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.horizontalLine}></View>
                <Text className="text-md text-[#8C8989]">
                Discussions on digital mindfulness and balance.
                </Text>
              </View>
              </TouchableOpacity>
            </View>

            {/* Addiction Help Forum Channel */}
            <View>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Addiction-Help"); // Navigate to the Addiction Help page
              }}
              >
              <View className="flex flex-col bg-white/70 rounded-lg p-4 m-5">
                <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-semibold">
                  Addiction Help
                </Text>
                {/* Button to open a modal or perform additional actions */}
                <TouchableOpacity
                  onPress={() => {
                  router.replace({
                    pathname: "/Addiction-Help",
                    params: { showModal: "true" }, // Pass parameters to the route
                  });
                  }}
                >
                  <Image source={icon.add} className="w-8 h-8 mt-1"></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.horizontalLine}></View>
                <Text className="text-md text-[#8C8989]">
                Discussions on digital addiction and recovery.
                </Text>
              </View>
              </TouchableOpacity>
            </View>

            {/* Digital Wellness Forum Channel */}
            <View>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Digital-Wellness"); // Navigate to the Digital Wellness page
              }}
              >
              <View className="flex flex-col bg-white/70 rounded-lg p-4 m-5">
                <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-semibold">
                  Digital Wellness
                </Text>
                {/* Button to open a modal or perform additional actions */}
                <TouchableOpacity
                  onPress={() => {
                  router.replace({
                    pathname: "/Digital-Wellness",
                    params: { showModal: "true" }, // Pass parameters to the route
                  });
                  }}
                >
                  <Image source={icon.add} className="w-8 h-8 mt-1"></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.horizontalLine}></View>
                <Text className="text-md text-[#8C8989]">
                Discussions on digital wellness and health.
                </Text>
              </View>
              </TouchableOpacity>
            </View>

            {/* Offline Bliss Forum Channel */}
            <View>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Offline-Bliss"); // Navigate to the Offline Bliss page
              }}
              >
              <View className="flex flex-col bg-white/70 rounded-lg p-4 m-5">
                <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-semibold">
                  Offline Bliss
                </Text>
                {/* Button to open a modal or perform additional actions */}
                <TouchableOpacity
                  onPress={() => {
                  router.replace({
                    pathname: "/Offline-Bliss",
                    params: { showModal: "true" }, // Pass parameters to the route
                  });
                  }}
                >
                  <Image source={icon.add} className="w-8 h-8 mt-1"></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.horizontalLine}></View>
                <Text className="text-md text-[#8C8989]">
                Discussions on digital mindfulness and balance.
                </Text>
              </View>
              </TouchableOpacity>
            </View>

            {/* Technical Help Forum Channel */}
            <View>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Technical-Help"); // Navigate to the Technical Help page
              }}
              >
              <View className="flex flex-col bg-white/70 rounded-lg p-4 m-5">
                <View className="flex flex-row justify-between items-center">
                <Text className="text-xl font-rubik-semibold">
                  Technical Help
                </Text>
                {/* Button to open a modal or perform additional actions */}
                <TouchableOpacity>
                  <Image source={icon.add} className="w-8 h-8 mt-1"></Image>
                </TouchableOpacity>
                </View>
                <View style={styles.horizontalLine}></View>
                <Text className="text-md text-[#8C8989]">
                Discussions on technical issues and troubleshooting.
                </Text>
              </View>
              </TouchableOpacity>
            </View>
            <View className="flex flex-col rounded-lg p-4 m-5"></View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      <Modal transparent visible={infoModalVisible}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="p-4 bg-white rounded-lg w-[80%]">
            <Text className="text-xl font-rubik-semibold text-center mb-2 ">
              Rules and Regulations for Forum
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">1.</Text> Be respectful of others and
              their opinions.This includes being polite and avoiding personal
              attacks.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">2.</Text> Use of offensive or
              inappropriate language is strictly prohibited.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">3.</Text> Do not post any content that
              is illegal or violates the terms of service of the platform.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">4.</Text> Do not spam the forum with
              multiple posts or advertisements.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">5.</Text> Do not post any content that
              is offensive or inappropriate.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">6.</Text> Do not post any content that
              is defamatory or libelous.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">7.</Text> Do not post any content that
              is harassing or threatening.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">8.</Text> Do not post any content that
              is discriminatory or hateful.
            </Text>
            <Text className="font-rubik text-justify">
              <Text className="font-bold">9.</Text> Do not post any content that
              is sexually explicit
            </Text>
            <Text className="font-rubik-semibold text-justify mt-2 mb-2">
              Our team heavily moderates the forum. We have the right to remove
              any content that violates the rules. Depending on the type of
              violation, we may issue a warning or immediately ban the user from
              the App. Three warnings will result in a ban from the App. We are
              issuing hardware bans for users who violate the rules.
            </Text>
            <Text className="font-libreCaslon-italic text-center mt-4 text-[#7769B7] text-xl">
              Thank you for your cooperation.
            </Text>
            <TouchableOpacity
              onPress={() => setInfoModalVisible(false)}
              className="bg-gray-400 rounded-md p-3 mt-4"
            >
              <Text className="text-white text-center font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default forum;

const styles = StyleSheet.create({
  verticalLine: {
    width: 3,
    borderRadius: 20,
    backgroundColor: "#7769B7",
  },
  horizontalLine: {
    height: 3,
    borderRadius: 20,
    backgroundColor: "#7769B7",
    marginVertical: 10,
  },
});

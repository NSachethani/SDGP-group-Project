import {
  View,
  Text,
  BackHandler,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import icon from "@/constants/icon";
import { useUser } from "@clerk/clerk-expo";

const forum = () => {
  const handleBack = async () => {
    try {
      router.replace("/(root)/(tabs)/home"); // redirect to login page
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  const { user } = useUser();

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
                  Community Forum
                </Text>
                <TouchableOpacity>
                  <Image source={icon.info} className="w-10 h-10" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="bg-white/60 rounded-lg p-4 flex justify-center ml-5 mr-5">
              <View>
                <View className="flex flex-col items-center bg-white rounded-lg">
                  <Text className="text-center text-2xl font-ztgatha">
                    Forum Profile Status:
                  </Text>
                </View>
                <View className="flex justify-center items-center m-2">
                  <Image
                    source={{
                      uri:
                        user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                    }}
                    style={{ width: 50, height: 50, borderRadius: 110 / 2 }}
                    className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                  />
                </View>
                <View className="flex flex-col justify-center p-1 bg-slate-50 rounded-lg">
                <Text className="font-ztgatha text-lg ">
                  <Text className="font-rubik-medium">Forum Name: </Text>
                  {user?.firstName || "Not Found"}{" "}
                  {user?.lastName || "Not Found"}
                </Text>
               
                  <Text className="font-ztgatha text-lg ">
                    <Text className="font-rubik-medium">
                      Warns:{" "}
                    </Text>
                    0
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default forum;

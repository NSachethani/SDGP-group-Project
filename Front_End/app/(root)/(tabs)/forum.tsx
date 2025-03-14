import {
  View,
  Text,
  BackHandler,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  const [modalVisible, setModalVisible] = useState(false);

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
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image source={icon.info} className="w-10 h-10" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white/60 rounded-lg p-4 flex flex-row justify-around ml-4 mr-4">
              <View>
                <Text className="font-ztgatha text-lg ">
                  <Text className="font-rubik-medium">
                    &#8226; Forum Name:{" "}
                  </Text>
                  {user?.firstName || "Not Found"}{" "}
                  {user?.lastName || "Not Found"}
                </Text>

                <Text className="font-ztgatha text-lg ">
                  <Text className="font-rubik-medium">&#8226; Warns: </Text>0
                </Text>
              </View>
              <View style={styles.verticalLine}></View>
              <View className="flex justify-center items-center">
                <Image
                  source={{
                    uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  style={{ width: 50, height: 50, borderRadius: 110 / 2 }}
                  className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300"
                />
              </View>
            </View>
            <View className="ml-5 mt-4">
              <Text className="font-rubik-medium text-lg">Forum Channels:</Text>
            </View>
            <View>
              <TouchableOpacity
              onPress={() => {
                        router.replace("/Mindful-Living");
                      }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Mindful Living
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; Discussions on digital mindfulness and balance.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Digital-Wellness");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Digital Wellness
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; A broad forum for overall digital well-being.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Focus-Flow");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Focus & Flow
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; Helping users regain focus and productivity.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Healthy-Habits");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Healthy Habits
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; Encourages positive digital and offline habits.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Addiction-Help");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Addiction Help
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; A forum for those struggling with digital addiction.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Offline-Bliss");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Offline Bliss
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; Discussions on enjoying life beyond screens.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() => {
                router.replace("/Technical-Help");
              }}
              >
                <View className="bg-white/60 rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4 mb-20">
                  <Text className="text-center font-ztgatha text-2xl mb-2">
                    Tech Help
                  </Text>
                  <View style={styles.horizontalLine}></View>
                  <Text className="text-md font-rubik-medium mt-2">
                    &#8226; A forum for technical support and troubleshooting.
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4 mb-20"></View>
              <View className="rounded-lg p-4 flex flex-col justify-between ml-4 mr-4 mt-4 mb-20"></View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
      {modalVisible && (
        <Modal transparent>
          <View className="flex-1 justify-center items-center bg-black/50 ">
            <View className="bg-white p-4 rounded-lg w-[90%]">
              <Text className="font-rubik-semibold text-xl text-center text-black">
                Rules and Regulation of Forum
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">1.</Text> Be respectful of
                others and their opinions. This includes being polite and
                courteous.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">2.</Text> Do not post any
                personal information about yourself or others.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">3.</Text> Do not post any
                inappropriate content. This includes offensive language, images,
                and videos.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">4.</Text> Do not spam the forum
                with multiple posts or comments.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">5.</Text> Do not post any
                content that is illegal or violates any laws.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">6.</Text> Do not post any
                content that is defamatory or libelous.
              </Text>
              <Text className="m-1text-justify">
                <Text className="font-semibold">7.</Text> Do not post any
                content that is discriminatory or hateful.
              </Text>
              <Text className="m-1 text-justify">
                <Text className="font-semibold">8.</Text> Do not post any
                content that is harassing or threatening.
              </Text>
              <Text className="font-rubik-semibold m-2 text-justify">
                Our team heavily moderates the forum. We have the right to
                remove any content that violates the rules. Depending on the
                type of violation, we may issue a warning or immediately ban the
                user from the App. Three warnings will result in a ban from the
                App. We are issuing hardware bans for users who violate the
                rules.
              </Text>
              <Text className="font-charm text-center text-2xl m-4 text-[#7769B7]">
                Thank you for your cooperation.
              </Text>
              <Text></Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#7769B7",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  },
});

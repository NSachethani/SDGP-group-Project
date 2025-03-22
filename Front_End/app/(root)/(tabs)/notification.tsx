import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import icon from "@/constants/icon";
import Icon from "@/constants/icon";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import {
  fetchNotification,
  fetchNotification2,
  fetchNotification3,
  fetchNotification4,
  fetchNotification5,
} from "@/service/notificationService";
import { useUser } from "@clerk/clerk-expo";
import NotificationItem from "@/components/NotificationItem";
import NotificationItem2 from "@/components/NotificationItem2";
import NotificationItem3 from "@/components/NotificationItem3";
import NotificationItem4 from "@/components/NotificationItem4";
import NotificationItem5 from "@/components/NotificationItem5";

const notification = () => {
  const { user } = useUser();

  const handleBack = async () => {
    try {
      router.replace("/(root)/(tabs)/home"); // redirect to login page
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  const [notification, setNotification] = useState<any[]>([]);
  const [notification2, setNotification2] = useState<any[]>([]);
  const [notification3, setNotification3] = useState<any[]>([]);
  const [notification4, setNotification4] = useState<any[]>([]);
  const [notification5, setNotification5] = useState<any[]>([]);

  useEffect(() => {
    getNotification();
    getNotification2();
    getNotification3();
    getNotification4();
    getNotification5();
  }, []);

  const getNotification = async () => {
    let res = await fetchNotification(user?.id);
    console.log("notifications", res);
    if (res.success) setNotification(res.data ?? []);
  };

  const getNotification2 = async () => {
    let res = await fetchNotification2(user?.id);
    console.log("notifications", res);
    if (res.success) setNotification2(res.data ?? []);
  };

  const getNotification3 = async () => {
    let res = await fetchNotification3(user?.id);
    console.log("notifications", res);
    if (res.success) setNotification3(res.data ?? []);
  };

  const getNotification4 = async () => {
    let res = await fetchNotification4(user?.id);
    console.log("notifications", res);
    if (res.success) setNotification4(res.data ?? []);
  };

  const getNotification5 = async () => {
    let res = await fetchNotification5(user?.id);
    console.log("notifications", res);
    if (res.success) setNotification5(res.data ?? []);
  };

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView>
            <View>
              <View className="bg-white/60 rounded-lg p-4 flex justify-center m-5">
                <View className="flex flex-row justify-between">
                  <TouchableOpacity onPress={handleBack}>
                    <Image source={icon.backArrow2} className="w-8 h-8 mt-1" />
                  </TouchableOpacity>
                  <Text className="text-center text-2xl font-semibold text-[#7769B7]">
                    Notification
                  </Text>
                  <TouchableOpacity
                  //onPress={}
                  >
                    <Icon.comdelete color="black" size={30} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {[
              ...notification,
              ...notification2,
              ...notification3,
              ...notification4,
              ...notification5,
            ].map((item) => {
              const Component =
                item.type === "type1"
                  ? NotificationItem
                  : item.type === "type2"
                  ? NotificationItem2
                  : item.type === "type3"
                  ? NotificationItem3
                  : item.type === "type4"
                  ? NotificationItem4
                  : NotificationItem5;
              return <Component item={item} key={item.id} router={router} />;
            })}
            {notification.length === 0 && (
              <View className="flex items-center justify-center">
                <Text className="text-center text-lg font-rubik-semibold">
                  No notifications Yet
                </Text>
              </View>
            )}
            <View className="flex justify-center bg-white/60 rounded-3xl mt-10"></View>
            <View className="flex justify-center bg-white/60 rounded-3xl mt-10"></View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default notification;

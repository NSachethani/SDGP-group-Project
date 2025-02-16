import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icon";
const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  title: string;
  icon: any;
}) => (
  <View className="flex-1 mt-2 flex flex-col items-center justify-center">
    <Image source={icon} resizeMode="contain" className="w-12" />
  </View>
);

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#647ab6",
          elevation: 0,
          borderTopWidth: 0,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "home",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.home} focused={focused} title="Home" />
          ),
        }}
      />

      <Tabs.Screen
        name="gameFeild"
        options={{
          title: "gameFeild",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.games} focused={focused} title="gameFeild" />
          ),
        }}
      />

      <Tabs.Screen
        name="forum"
        options={{
          title: "forum",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.forum} focused={focused} title="forum" />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "notification",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={icons.notification}
              focused={focused}
              title="notification"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.settings} focused={focused} title="settigns" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

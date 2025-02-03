import { View, Text, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import icons from "@/constants/icons";
const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  title: string;
  icon: any;
}) => (
  <View className="flex-1 mt-2 flex flex-col items-center">
    <Image source={icon} resizeMode="contain" className="size-10" />
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
          backgroundColor: "transparent",
          elevation: 0,
          borderTopWidth: 0,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
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
        name="settigns"
        options={{
          title: "settigns",
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={icons.settings} focused={focused} title="settigns" />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

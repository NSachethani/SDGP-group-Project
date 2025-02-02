import React from "react";
import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <>
      <Redirect href="/welcome" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text className="font-bold text-lg my-10">Welcome to Pause+</Text>
        <Link href="/sign-in">Sign In</Link>
        <Link href="/forum">Forum</Link>
        <Link href="/gameFeild">Game Feild</Link>
        <Link href="/notification">Notification</Link>
        <Link href="/settigns">Settings</Link>
        <Link href="/properties/5">Questions</Link>
      </View>
    </>
  );
}

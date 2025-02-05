import React, { useState } from "react";
import { Link, Redirect } from "expo-router";
import {
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
};

export default function Index() {
  const [selectedOption, setSelectedOption] = useState("Daily");
  const currentDate = `Today, ${getCurrentDate()}`;
  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <View className="flex flex-row justify-between items-center">
            <Text className="text-3xl font-rubik-semibold text-black ml-4 mt-6">
              Dashboard
            </Text>
            <View className="mt-5 mr-4 bg-white rounded-full w-[130px] h-[45px] shadow-lg ">
              <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue) => setSelectedOption(itemValue)}
                style={{
                  color: "#9aa19c",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                  marginTop: -7,
                }}
              >
                <Picker.Item
                  label="Daily"
                  value="Daily"
                  style={{ fontSize: 18, color: "#5a5c5a" }}
                />
                <Picker.Item
                  label="Weekly"
                  value="Weekly"
                  style={{ fontSize: 18, color: "#5a5c5a" }}
                />
                <Picker.Item
                  label="Monthly"
                  value="Monthly"
                  style={{ fontSize: 18, color: "#5a5c5a" }}
                />
              </Picker>
            </View>
          </View>
            <View className="flex justify-end flex-col ">
            <Text className="text-lg text-['#797575'] ml-4 mb-3">
              Analytics for{" "}
              <Text className="text-lg text-[#4D5A60] ">{currentDate}</Text>
            </Text>
            <View style={[styles.horizontalLine1]} />
            </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  dropdown: {
    marginTop: 10,
    marginRight: 10,
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
  },

  horizontalLine1: {
    height: 2,
    backgroundColor: "#ABAAAF",
    width: "100%",
    position: "absolute",
  },
});

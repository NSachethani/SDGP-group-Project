import {
  Text,
  View,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  NativeModules,
  ScrollView,
  TouchableOpacity,
  RefreshControl, // <--- new import
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { Picker } from "@react-native-picker/picker";
import icon from "@/constants/icon";
import SocialMediaMeter from "@/components/SocialMediaMeter";

const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
};

const { ScreenTimeModule } = NativeModules;

const formatTime = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}hr, ${mins}mins`;
};

// New helper to format full date.
const formatFullDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

// Updated helper to get analytics date using full structure.
const getFormattedAnalyticsDate = (usageData: any[], selectedDay: any) => {
  const idx = usageData.findIndex((day) => day === selectedDay);
  // Compute the day from index (assuming index 0 is today)
  const dayDate = new Date(Date.now() - idx * 86400000);
  if (idx === 0) return `Today, ${formatFullDate(dayDate)}`;
  if (idx === 1) return `Yesterday, ${formatFullDate(dayDate)}`;
  return formatFullDate(dayDate);
};

export default function home() {
  const [selectedOption, setSelectedOption] = useState("Daily");
  const [usageData, setUsageData] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false); // new state

  // Extracted function to fetch usage data
  const fetchUsageData = () => {
    ScreenTimeModule.checkAndRequestUsageAccess()
      .then(() => ScreenTimeModule.getUsageData())
      .then((data: any) => {
        setUsageData(data.days);
        if (data.days && data.days.length > 0) {
          setSelectedDay(data.days[0]);
        }
      })
      .catch((err: any) => {
        console.warn(err);
      });
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsageData();
    setRefreshing(false);
  };

  // Set containerHeight to match the actual progressContainer height (50)
  const containerHeight = 50;
  const effectiveMax = useMemo(() => {
    if (usageData.length === 0) return 7200000; // fallback 2 hours if no data
    const maxVal = Math.max(...usageData.map((day) => day.totalScreenTime));
    return maxVal + 7200000; // extra 2 hours added
  }, [usageData]);

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Top header with title and picker */}
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
                <Text className="text-lg text-[#4D5A60] ">
                  {selectedDay
                    ? getFormattedAnalyticsDate(usageData, selectedDay)
                    : formatFullDate(new Date())}
                </Text>
              </Text>
              <View style={[styles.horizontalLine1]} />
            </View>
            <View className="flex justify-center bg-white/75 rounded-3xl m-2">
              <View className="flex justify-center items-center mb-1">
                <Text className="text-md font-semibold text-[#8C8989]">
                  SCREEN TIME
                </Text>
              </View>
              {/* Center selected day container */}
              {selectedDay && (
                <View className="flex justify-center items-center mb-3">
                  <Text className="text-xl font-rubik-semibold text-black mb-1">
                    {formatTime(selectedDay.totalScreenTime)}
                  </Text>
                  <View className=" border-2 border-[#8D5395] rounded-full">
                    <Text className="text-md text-[#8D5395] font-rubik ml-4 mr-4">
                      {usageData.findIndex((day) => day === selectedDay) === 0
                        ? "Today"
                        : usageData.findIndex((day) => day === selectedDay) ===
                          1
                        ? "Yesterday"
                        : selectedDay.date}
                    </Text>
                  </View>
                </View>
              )}

              {/* Horizontal list of progress bars */}
              <View className="flex justify-center items-center">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.barsContainer}
                >
                  {usageData.map((day, idx) => {
                    // Calculate fill height based on updated containerHeight
                    const fillHeight =
                      (day.totalScreenTime / effectiveMax) * containerHeight;
                    const dayDate = new Date(Date.now() - idx * 86400000);
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSelectedDay(day)}
                        style={styles.progressBarWrapper}
                      >
                        <View style={styles.progressContainer}>
                          <View
                            style={[
                              styles.progressFill,
                              { height: fillHeight },
                            ]}
                          />
                        </View>
                        <Text className="text-sm text-[#8C8989] font-rubik mt-2 mb-1">
                          {idx === 0 ? "Today" : day.date}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
            {/* New section: Today's Total Unlocks */}
            {/* <View className="flex justify-center items-center mt-2 mb-4">
              <Text className="text-sm text-[#8C8989] font-rubik">
                Total Unlocks Today: {usageData[0] ? usageData[0].unlocks : 0}
              </Text>
            </View> */}
            <View className="flex justify-center bg-white/60 rounded-3xl m-2">
              <View className="flex flex-row w-full mt-5 mb-5 ml-1 justify-around">
                <View className="flex justify-center items-center">
                  <Image source={icon.fingrprint} className="w-20 h-20" />
                </View>
                <View className="flex justify-center items-center">
                  <Text className="text-md font-semibold text-[#8C8989]">
                    TOTAL UNLOCKS{"\n"}{" "}
                    <Text className="text-3xl text-black font-rubik-bold">
                      {selectedDay ? selectedDay.unlocks : 0}
                    </Text>
                  </Text>
                </View>
                <View style={styles.verticalLine}></View>
                <View className="flex justify-center items-center rounded-xl bg-[#8D5395]/80 flex-wrap mr-1">
                  <Text className="text-md font-ztgatha text-white m-2">
                    TOTAL DETOX TIME
                    {"\n"}{" "}
                    <Text className="text-2xl text-white font-rubik-semibold">
                      {selectedDay && selectedDay.apps
                        ? formatTime(
                            selectedDay.apps.find(
                              (app: any) =>
                                app.name === "com.wolfwiz12.pauseplus"
                            )?.screenTime || 0
                          )
                        : "0hr, 0mins"}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
            <View className="flex justify-center bg-white/60 rounded-3xl mt-2 ">
              {/* Social media usage meter */}
              {selectedDay && selectedDay.apps && (
                <SocialMediaMeter appsData={selectedDay.apps} />
              )}
            </View>
            <View className="flex justify-center bg-white/60 rounded-3xl mt-10"></View>
            <View className="flex justify-center bg-white/60 rounded-3xl mt-10">
              {selectedDay && selectedDay.apps
                ? selectedDay.apps.map((app: any, index: number) => (
                    <Text key={index} style={styles.appText}>
                      {app.name}: {formatTime(app.screenTime)}
                    </Text>
                  ))
                : null}

              <View className="mt-4 ml-4">
                {usageData.map((day, idx) => (
                  <View key={idx} style={{ marginBottom: 20 }}>
                    <Text style={styles.dayLabel}>
                      {formatTime(day.totalScreenTime)}
                    </Text>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { height: (day.totalScreenTime / 3600000) * 100 },
                        ]}
                      />
                    </View>
                    <Text style={styles.unlocksText}>
                      Total Unlocks: {day.unlocks}
                    </Text>
                    {day.apps &&
                      day.apps.map((app: any, index: number) => (
                        <Text key={index} style={styles.appText}>
                          {app.name}: {formatTime(app.screenTime)}
                        </Text>
                      ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  selectedDayContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  selectedDayTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  selectedDayLabel: {
    fontSize: 16,
    color: "#555",
  },
  barsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarWrapper: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  progressContainer: {
    width: 30,
    height: 50, // container height updated to 50
    backgroundColor: "#daeef7", // background color for progress container
    borderRadius: 5,
    overflow: "hidden",
    justifyContent: "flex-end", // align fill at bottom
  },
  progressFill: {
    width: "100%",
    backgroundColor: "#8D5395",
    borderRadius: 5,
  },
  progressBar: {
    width: "100%",
    backgroundColor: "#8D5395",
    borderRadius: 5,
  },
  barLabel: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
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
  dayLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  unlocksText: {
    marginTop: 5,
    fontSize: 14,
    color: "#5a5c5a",
  },
  appText: {
    fontSize: 12,
    color: "#797575",
  },
  verticalLine: {
    width: 3,
    borderRadius: 20,
    backgroundColor: "#DDC8FF",
  },
});

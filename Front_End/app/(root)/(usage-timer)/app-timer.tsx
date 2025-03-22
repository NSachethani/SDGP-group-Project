import {
  View,
  Text,
  BackHandler,
  Modal,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import * as Notifications from "expo-notifications";
// Assume ScreenTimeModule is linked via native modules
import { NativeModules } from "react-native";
import icon from "@/constants/icon";
import {
  scheduleBackgroundTask,
  triggerManualCheck,
} from "@/components/NotificationManager";
const { ScreenTimeModule } = NativeModules;

// Define the same social apps list used in ScreenTimeService.kt
const SOCIAL_APPS = [
  "facebook",
  "instagram",
  "whatsapp",
  "youtube",
  "tiktok",
  "snapchat",
  "twitter",
  "linkedin",
  "pinterest",
  "telegram",
  "reddit",
  "wechat",
  "tinder",
  "discord",
];

const ITEM_HEIGHT = 40;
const HOURS_DATA = Array.from({ length: 25 * 10 }, (_, i) => i % 25);
// Update minutes data array to multiples of 5 instead of 0-59 repeated
const MINUTES_DATA = Array.from({ length: 12 * 10 }, (_, i) => (i % 12) * 5);

// Add a new helper for formatting timer values in minutes
const formatTimer = (totalMinutes: number): string => {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}hr, ${mins}mins`;
};

const Timer = () => {
  // Back button to go to home screen
  useEffect(() => {
    const backAction = () => {
      router.replace("/(root)/(tabs)/home");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  // State for detected apps from usage data (e.g., from today)
  const [detectedApps, setDetectedApps] = useState<
    Array<{ name: string; screenTime: number }>
  >([]);
  // Reminder times saved locally { appName: thresholdInMinutes }
  const [reminderTimes, setReminderTimes] = useState<{ [app: string]: number }>(
    {}
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);

  // Fetch detected apps and saved reminders on mount
  useEffect(() => {
    // Replace callback usage with promise-based call and union apps from all days
    ScreenTimeModule.getUsageData()
      .then((data: any) => {
        if (data.days && data.days.length > 0) {
          const appsUnion: {
            [key: string]: { name: string; screenTime: number };
          } = {};
          data.days.forEach((day: any) => {
            if (day.apps) {
              day.apps.forEach((app: any) => {
                const name = app.name.toLowerCase();
                if (SOCIAL_APPS.includes(name)) {
                  if (!appsUnion[name]) {
                    appsUnion[name] = { name, screenTime: app.screenTime };
                  }
                }
              });
            }
          });
          setDetectedApps(Object.values(appsUnion));
        }
      })
      .catch((err: any) => console.warn(err));

    // Load reminder settings from AsyncStorage
    AsyncStorage.getItem("reminderTimes").then((stored) => {
      if (stored) setReminderTimes(JSON.parse(stored));
    });
  }, []);

  const saveReminder = async () => {
    if (!selectedApp) return;
    const totalMinutes = selectedHours * 60 + selectedMinutes;
    const newReminders = {
      ...reminderTimes,
      [selectedApp.toLowerCase()]: totalMinutes,
    };
    setReminderTimes(newReminders);
    await AsyncStorage.setItem("reminderTimes", JSON.stringify(newReminders));
    console.log(
      "[app-timer] Saved reminder for",
      selectedApp,
      ":",
      totalMinutes,
      "minutes"
    );
    // Schedule the background task
    await scheduleBackgroundTask();
    // For immediate testing, trigger a manual check in NotificationManager:
    await triggerManualCheck();
    setModalVisible(false);
    setSelectedApp(null);
  };

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 20 }}>
            <Text
              style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}
            >
              Set Reminder Timers
            </Text>
            <ScrollView>
              {detectedApps.map((app, idx) => (
                <View
                  key={idx}
                  className="flex-row justify-between items-center mb-2 p-2 bg-white/50 rounded-lg"
                >
                  <View className="flex-row items-center">
                    <Text className="text-md font-rubik">
                      {app.name.toUpperCase()}
                    </Text>
                    {reminderTimes[app.name.toLowerCase()] != null && (
                      <Text className="text-md font-rubik ml-2">
                        {formatTimer(reminderTimes[app.name.toLowerCase()])}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedApp(app.name);
                      const saved = reminderTimes[app.name.toLowerCase()];
                      if (typeof saved === "number") {
                        setSelectedHours(Math.floor(saved / 60));
                        setSelectedMinutes(saved % 60);
                      } else {
                        setSelectedHours(0);
                        setSelectedMinutes(0);
                      }
                      setModalVisible(true);
                    }}
                  >
                    <Image
                      source={icon.timer}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="slide">
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#000000aa",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Set reminder for {selectedApp?.toUpperCase()}
                  </Text>
                  {/* New scroll pickers for hours & minutes */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      height: 120,
                    }}
                  >
                    {/* Hours picker using FlatList */}
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text style={{ marginBottom: 5 }}>Hours</Text>
                      <FlatList
                        data={HOURS_DATA}
                        keyExtractor={(item, index) => "hour-" + index}
                        getItemLayout={(_, index) => ({
                          length: ITEM_HEIGHT,
                          offset: ITEM_HEIGHT * index,
                          index,
                        })}
                        initialScrollIndex={Math.floor(HOURS_DATA.length / 2)}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        // Set padding so the middle item is centered
                        contentContainerStyle={{
                          paddingTop: 40,
                          paddingBottom: 60,
                        }}
                        onMomentumScrollEnd={(e) => {
                          const index = Math.round(
                            e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                          );
                          setSelectedHours(HOURS_DATA[index]);
                        }}
                        renderItem={({ item }) => (
                          <Text
                            style={{
                              height: ITEM_HEIGHT,
                              textAlign: "center",
                              fontSize: 16,
                              color:
                                item === selectedHours ? "#8D5395" : "#000",
                            }}
                          >
                            {item}
                          </Text>
                        )}
                        initialNumToRender={25} // reduced number of initial renders
                        maxToRenderPerBatch={25} // render in small batches
                        windowSize={3} // small window size for faster rendering
                      />
                    </View>
                    {/* Minutes picker using FlatList */}
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text style={{ marginBottom: 5 }}>Minutes</Text>
                      <FlatList
                        data={MINUTES_DATA}
                        keyExtractor={(item, index) => "min-" + index}
                        getItemLayout={(_, index) => ({
                          length: ITEM_HEIGHT,
                          offset: ITEM_HEIGHT * index,
                          index,
                        })}
                        initialScrollIndex={Math.floor(MINUTES_DATA.length / 2)}
                        showsVerticalScrollIndicator={false}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        contentContainerStyle={{
                          paddingTop: 40,
                          paddingBottom: 90,
                        }}
                        onMomentumScrollEnd={(e) => {
                          const index = Math.round(
                            e.nativeEvent.contentOffset.y / ITEM_HEIGHT
                          );
                          setSelectedMinutes(MINUTES_DATA[index]);
                        }}
                        renderItem={({ item }) => (
                          <Text
                            style={{
                              height: ITEM_HEIGHT,
                              textAlign: "center",
                              fontSize: 16,
                              color:
                                item === selectedMinutes ? "#8D5395" : "#000",
                            }}
                          >
                            {item}
                          </Text>
                        )}
                        initialNumToRender={25} // reduced number of initial renders
                        maxToRenderPerBatch={25} // render in small batches
                        windowSize={3} // small window size for faster rendering
                      />
                    </View>
                  </View>
                  {/* Added spacer for more room between scrolls and buttons */}
                  <View style={{ height: 20 }} />
                  {/* Save button: on save, combine hours & minutes (total minutes = h*60 + m) */}
                  <TouchableOpacity
                    onPress={saveReminder}
                    style={{
                      backgroundColor: "#8D5395",
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                  {/* New Reset button */}
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedApp) {
                        const newReminders = { ...reminderTimes };
                        delete newReminders[selectedApp.toLowerCase()];
                        setReminderTimes(newReminders);
                        AsyncStorage.setItem(
                          "reminderTimes",
                          JSON.stringify(newReminders)
                        );
                      }
                      setModalVisible(false);
                      setSelectedApp(null);
                    }}
                    style={{
                      backgroundColor: "#ccc",
                      padding: 10,
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      Reset
                    </Text>
                  </TouchableOpacity>
                  {/* Cancel button */}
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedApp(null);
                    }}
                  >
                    <Text style={{ color: "#8D5395", textAlign: "center" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default Timer;
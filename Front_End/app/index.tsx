import React, { useEffect } from "react";
import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { LogLevel, OneSignal } from "react-native-onesignal";
import {
  startFrequentRefresh,
  stopFrequentRefresh,
} from "@/components/NotificationManager";

const TASK_NAME = "BACKGROUND_NOTIFICATION_TASK";

async function registerBackgroundFetchAsync() {
  try {
    return BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.log("Error registering background task:", err);
  }
}

export default function App() {
  // Remove this method to stop OneSignal Debugging
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // OneSignal Initialization
  OneSignal.initialize("1902ad14-5703-46af-8df8-e2a291f67ab6");

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener("click", (event) => {
    console.log("OneSignal: notification clicked:", event);
  });
  const { isSignedIn } = useAuth();
  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  useEffect(() => {
    // Start automatic refresh when app loads
    startFrequentRefresh();
    // Stop refresh when component unmounts
    
  }, []);
  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <Redirect href={"/(auth)/welcome"} />;
}

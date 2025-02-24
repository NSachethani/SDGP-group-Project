import React, { useEffect } from "react";
import { View } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

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
  const { isSignedIn } = useAuth();
  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  if (isSignedIn) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  }
  return <Redirect href={"/(auth)/welcome"} />;
}

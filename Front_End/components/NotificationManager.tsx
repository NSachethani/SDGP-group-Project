import { View, Text } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { NativeModules } from "react-native";

const { ScreenTimeModule } = NativeModules;
const TASK_NAME = "CHECK_USAGE_TASK";

// Set a notification handler so that notifications are shown even if the app is in foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationManager = () => {
  return (
    <View>
      <Text>NotificationManager</Text>
    </View>
  );
};

// Schedules a local notification and logs the event.
export async function sendUsageNotification(appName: string) {
  console.log(
    `[NotificationManager] Notification triggered for ${appName.toUpperCase()}`
  );
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${appName.toUpperCase()} Usage Exceeded!`,
      body: `Your usage timer is exceeded for ${appName.toUpperCase()}.`,
    },
    trigger: { seconds: 1, repeats: false } as any,
  });
}

// Check usage and compare with user-set timer limits.
export async function checkUsageAndNotify() {
  try {
    const now = new Date();
    console.log(
      `[NotificationManager] checkUsageAndNotify invoked at ${now.toISOString()}`
    );
    const usageData = await ScreenTimeModule.getUsageData();
    console.log(
      "[NotificationManager] Retrieved usageData:",
      usageData.days ? `Days count: ${usageData.days.length}` : "No days data"
    );
    const timerStr = await AsyncStorage.getItem("reminderTimes");
    if (!timerStr) {
      console.log("[NotificationManager] No reminderTimes found.");
      return;
    }
    const timers = JSON.parse(timerStr);
    Object.keys(timers).forEach((appName) => {
      console.log(
        `[NotificationManager] Timer received for ${appName.toUpperCase()}: ${
          timers[appName]
        } minutes`
      );
    });
    const today = usageData.days && usageData.days[0];
    if (today && today.apps) {
      console.log(
        `[NotificationManager] Today data: totalScreenTime=${today.totalScreenTime}, unlocks=${today.unlocks}, apps count=${today.apps.length}`
      );
      // Deduplicate apps to avoid multiple notifications for the same app
      const processedApps = new Set<string>();
      for (const app of today.apps) {
        const name = app.name.toLowerCase();
        if (processedApps.has(name)) continue;
        processedApps.add(name);

        const limit = timers[name];
        if (limit && app.screenTime >= limit * 60000) {
          // Check if a notification was sent recently (e.g., within 20 hours)
          const key = `notified_${name}`;
          const lastNotifiedStr = await AsyncStorage.getItem(key);
          if (lastNotifiedStr) {
            const diff = now.getTime() - parseInt(lastNotifiedStr);
            if (diff < 20 * 60 * 60 * 1000) {
              console.log(
                `[NotificationManager] Notification for ${name.toUpperCase()} already sent recently.`
              );
              continue;
            }
          }
          console.log(
            `[NotificationManager] Usage for ${name.toUpperCase()} (${(
              app.screenTime / 60000
            ).toFixed(1)} minutes) exceeds limit (${limit} minutes)`
          );
          await sendUsageNotification(name);
          await AsyncStorage.setItem(key, now.getTime().toString());
        }
      }
    } else {
      console.log("[NotificationManager] No today data available.");
    }
  } catch (err) {
    console.warn("[NotificationManager] Error in checkUsageAndNotify", err);
  }
}

// Add functions to refresh usage data every 15 seconds
let refreshInterval: ReturnType<typeof setInterval> | null = null;

export function startFrequentRefresh() {
  if (!refreshInterval) {
    console.log(
      "[NotificationManager] Starting frequent refresh every 30 seconds."
    );
    refreshInterval = setInterval(() => {
      console.log(
        "[NotificationManager] Frequent refresh triggered at",
        new Date().toISOString()
      );
      checkUsageAndNotify();
    }, 30000);
  }
}

export function stopFrequentRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    console.log("[NotificationManager] Frequent refresh stopped.");
    refreshInterval = null;
  }
}

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await checkUsageAndNotify();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.warn("[NotificationManager] Background task error", err);
    return "failed";
  }
});

export async function scheduleBackgroundTask() {
  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 30,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.log("[NotificationManager] Error scheduling background task", err);
  }
}

export async function cancelBackgroundTask() {
  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
  } catch (err) {
    console.log("[NotificationManager] Error cancelling background task", err);
  }
}

export async function triggerManualCheck() {
  await checkUsageAndNotify();
}

export default NotificationManager;

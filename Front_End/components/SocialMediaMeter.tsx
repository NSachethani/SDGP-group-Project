import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import AppTimer from "../app/(root)/(usage-timer)/app-timer";
import { router } from "expo-router";

// List of social media apps to report. Use lower-case names.
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

// Color mapping for each social app.
const APP_COLORS: { [key: string]: string } = {
  facebook: "#1877F2",
  instagram: "#bc2a8d",
  whatsapp: "#25D366",
  youtube: "#FF0000",
  tiktok: "#ff0050",
  tiktok_lite: "#ff0050",
  snapchat: "#fffc00",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
  pinterest: "crimson",
  telegram: "#0088cc",
  reddit: "orangered",
  wechat: "#09B83E",
  tinder: "#fe3c72", // added tinder
  discord: "#7289DA", // added discord
};

const formatTime = (ms: number) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${hrs}hr, ${mins}mins`;
};

interface SocialMediaMeterProps {
  appsData: Array<{ name: string; screenTime: number }>;
}

export default function SocialMediaMeter({ appsData }: SocialMediaMeterProps) {
  const navigation = useNavigation();

  // Filter social apps with usage > 0 (using lowercase for comparison)
  const socialApps = useMemo(() => {
    return appsData
      ? appsData.filter(
          (app) =>
            SOCIAL_APPS.includes(app.name.toLowerCase()) && app.screenTime > 0
        )
      : [];
  }, [appsData]);

  // Total social media usage in ms.
  const totalSocialUsage = socialApps.reduce(
    (sum, app) => sum + app.screenTime,
    0
  );

  // Determine displayed usage. Default is total; if an app is selected, show that.
  const [selectedApp, setSelectedApp] = useState<null | {
    name: string;
    screenTime: number;
  }>(null);
  const centerUsage = selectedApp ? selectedApp.screenTime : totalSocialUsage;
  const centerLabel = selectedApp
    ? selectedApp.name.toUpperCase()
    : "Total Social Media Usage:";

  // Calculate segments: each segment angle proportionate to its usage.
  const segments = socialApps.map((app) => ({
    name: app.name.toLowerCase(),
    usage: app.screenTime,
    color: APP_COLORS[app.name.toLowerCase()] || "gray",
    proportion: app.screenTime / totalSocialUsage,
  }));

  // Ring dimensions.
  const size = 200;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDashoffset for each segment.
  let cumulative = 0;
  const segmentPaths = segments.map((segment) => {
    const offset = circumference * cumulative;
    const dash = circumference * segment.proportion;
    cumulative += segment.proportion;
    return { ...segment, dash, offset };
  });

  return (
    <View style={styles.container}>
      <View className="flex items-center justify-center">
        <Svg width={size} height={size}>
          <G rotation="-90" originX={size / 2} originY={size / 2}>
            {/* Background circle for reference */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#eee"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {segmentPaths.map((seg, idx) => (
              <Circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
                fill="none"
                onPress={() =>
                  setSelectedApp({ name: seg.name, screenTime: seg.usage })
                }
              />
            ))}
          </G>
        </Svg>
        <View style={styles.centerText}>
          <Text style={styles.usageText}>{formatTime(centerUsage)}</Text>
          <Text style={styles.labelText}>{centerLabel}</Text>
        </View>
      </View>
      {/* Render labels under ring */}
      <View style={styles.labelsContainer}>
        {segments.map((seg, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.labelItem}
            onPress={() =>
              setSelectedApp({ name: seg.name, screenTime: seg.usage })
            }
          >
            <View style={[styles.colorBox, { backgroundColor: seg.color }]} />
            <Text style={styles.labelName}>{seg.name.toUpperCase()}</Text>
            <Text style={styles.labelUsage}>{formatTime(seg.usage)}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.labelItem}
          onPress={() => setSelectedApp(null)}
        >
          <Text style={styles.totalLabelText}>TOTAL SOCIAL MEDIA USAGE</Text>
        </TouchableOpacity>
      </View>
      {/* Button for redirecting to app-timer screen */}
      <TouchableOpacity
        style={styles.reminderButton}
        onPress={() => {
          router.replace("/(root)/(usage-timer)/app-timer");
        }}
      >
        <Text style={styles.reminderButtonText}>Set app usage reminder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  centerText: {
    position: "absolute",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  usageText: { fontSize: 18, fontWeight: "bold", color: "#000" },
  labelText: { fontSize: 12, color: "#555", textAlign: "center" },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center",
  },
  labelItem: { flexDirection: "row", alignItems: "center", margin: 5 },
  colorBox: { width: 12, height: 12, marginRight: 4 },
  labelName: { fontSize: 12, fontWeight: "600", marginRight: 4 },
  labelUsage: { fontSize: 12, color: "#555" },
  totalLabelText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  reminderButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#8D5395",
    borderRadius: 5,
  },
  reminderButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
});

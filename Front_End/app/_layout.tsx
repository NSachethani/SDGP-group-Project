import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import "./global.css";


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "Rubik-ExtraBold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "Rubik-Light": require("../assets/fonts/Rubik-Light.ttf"),
    "Rubik-Medium": require("../assets/fonts/Rubik-Medium.ttf"),
    "Rubik-Regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "Rubik-SemiBold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "Charm-Bold": require("../assets/fonts/Charm-Bold.ttf"),
    "Charm-Regular": require("../assets/fonts/Charm-Regular.ttf"),
    "LibreCaslonText-Regular": require("../assets/fonts/LibreCaslonText-Regular.ttf"),
    "LibreCaslonText-Italic": require("../assets/fonts/LibreCaslonText-Italic.ttf"),
    "LibreCaslonText-Bold": require("../assets/fonts/LibreCaslonText-Bold.ttf"),
    "ZTGatha-SemiBold": require("../assets/fonts/ZTGatha-SemiBold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />


}
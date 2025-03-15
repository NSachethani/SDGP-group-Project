import { View, Text,BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { router } from "expo-router";


const DigitalWellness = () => {
   useEffect(() => {
        const backAction = () => {
          router.replace("/(root)/(tabs)/forum");
          return true;
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);
  return (
    <View>
      <Text>Digital-Wellness</Text>
    </View>
  )
}

export default DigitalWellness
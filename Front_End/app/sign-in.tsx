import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import signImg from "@/assets/images/sign.png";
import googleImg from "@/assets/icons/google.png";
import { login } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/globle-provider";
import { Redirect } from "expo-router";

const SignIn = () => {
  const {refetch, loading, isLoggedIn} = useGlobalContext();
  if (!loading && isLoggedIn) return <Redirect href={"/"} />;

  const handleLogin = async () => {
    const results = await login();
    if(results){
      refetch();

    }else{
      Alert.alert("Error", "Login Failed");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <Image
          source={signImg}
          className="w-full h-[500px]"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center font-rubik text-black-200 uppercase">
            Sign In to Pause+
          </Text>
          <Text className="text-3xl font-libreCaslon-italic text-black-300 text-center mt-3">
            Let’s get you closer to a{"\n"}
            <Text className="text-[#800080] "> healthier digital life!</Text>
          </Text>
          <Text className="text-lg font-rubik text-black-200 text-center mt-14">
            Login to Pause+ with Google
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-12"
          >
            <View className="flex flex-row justify-center items-center">
              <Image
                source={googleImg}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-lg font-rubik-medium text-black-300 ml-3">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

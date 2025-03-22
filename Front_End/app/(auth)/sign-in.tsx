import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import signImg from "@/assets/images/sign.png";
import googleImg from "@/assets/icons/google.png";
import InputField from "@/components/InputField";
import icon from "@/constants/icon";
import CustomButton from "@/components/CustomButton";
import { Link, router, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIN = () => {
  // Importing the signIn, setActive, and isLoaded functions from Clerk's useSignIn hook
  const { signIn, setActive, isLoaded } = useSignIn();

  // Using the useRouter hook from expo-router for navigation
  const router = useRouter();

  // Defining a state object to manage form inputs for email and password
  const [form, setForm] = useState({
    email: "", // Initial value for email input
    password: "", // Initial value for password input
  });

  // Function to handle the sign-in button press
  const onSignInPress = useCallback(async () => {
    // Ensure that the Clerk sign-in functionality is loaded before proceeding
    if (!isLoaded) return;

    try {
      // Attempt to sign in using the provided email and password
      const signInAttempt = await signIn.create({
        identifier: form.email, // Email input from the form
        password: form.password, // Password input from the form
      });

      // Check if the sign-in attempt is complete
      if (signInAttempt.status === "complete") {
        // Set the active session and navigate to the home page
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/"); // Redirect to the home page
      } else {
        // Log the sign-in attempt details if not complete
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // Handle errors during the sign-in process
      if (err?.errors?.[0]?.code === "form_password_incorrect") {
        // Show an alert if the password is incorrect
        Alert.alert("Error", "Your password is wrong!", [{ text: "OK" }]);
      } else {
        // Log any other errors
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [isLoaded, form.email, form.password]); // Dependencies for the useCallback hook

  return (
    <SafeAreaView>
      <ScrollView>
        <Image
          source={signImg}
          className="w-full h-[500px]"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center font-rubik text-black-200 uppercase">
            Sign up to Pause+
          </Text>
          <Text className="text-3xl font-libreCaslon-italic text-black-300 text-center mt-3 mb-5">
            Let’s get you closer to a{"\n"}
            <Text className="text-[#800080]"> healthier digital life!</Text>
          </Text>

          <InputField
            label="E-mail"
            placeholder="Enter your e-mail"
            icon={icon.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icon.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            className="mt-5"
          />
          <OAuth />
          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Dont't have an account?{" "}
            <Text className="text-primary-500">Sign In</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIN;

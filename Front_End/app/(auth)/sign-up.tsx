import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import signImg from "@/assets/images/sign.png";
import googleImg from "@/assets/icons/google.png";
import InputField from "@/components/InputField";
import icon from "@/constants/icon";

import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import { fetchAPI } from "@/lib/fetch";
import { useClerkSupabaseClient } from "@/lib/clerkSupabase";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });

  const [verification, setVerification] = useState({
    state: "default",
    code: "",
    error: "",
  });
  const supabase = useClerkSupabaseClient();
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.fname,
        lastName: form.lname,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            first_name: form.fname,
            last_name: form.lname,
            email: form.email,
            clerk_id: signUpAttempt.createdUserId,
          }),
        });
        const { data, error } = await supabase.from("tasks").insert({
          user_id: signUpAttempt.createdUserId,
          first_name: form.fname,
          last_name: form.lname,
          email: form.email,
        });
        if (error) {
          console.error("Supabase insert error:", error);
        } else {
          console.log("Supabase insert success:", data);
        }
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verfication Failed",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

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
            label="First Name"
            placeholder="Enter your first name"
            icon={icon.person}
            value={form.fname}
            onChangeText={(value) => setForm({ ...form, fname: value })}
          />
          <InputField
            label="Last Name"
            placeholder="Enter your Last name"
            icon={icon.person}
            value={form.lname}
            onChangeText={(value) => setForm({ ...form, lname: value })}
          />
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
            title="Sign Up"
            onPress={onSignUpPress}
            className="mt-5"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
          <ReactNativeModal
            isVisible={verification.state === "pending"}
            // onBackdropPress={() =>
            //   setVerification({ ...verification, state: "default" })
            // }
            onModalHide={() => {
              if (verification.state === "success") {
                setShowSuccessModal(true);
              }
            }}
          >
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Text className="font-JakartaExtraBold text-2xl mb-2">
                Verification
              </Text>
              <Text className="font-Jakarta mb-5">
                We've sent a verification code to {form.email}.
              </Text>
              <InputField
                label={"Code"}
                icon={icon.lock}
                placeholder={"12345"}
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerification({ ...verification, code })
                }
              />
              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}
              <CustomButton
                title="Verify Email"
                onPress={onPressVerify}
                className="mt-5 bg-success-500"
              />
            </View>
          </ReactNativeModal>
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <Image
                source={icon.check}
                className="w-[110px] h-[110px] mx-auto my-5"
              />
              <Text className="text-3xl font-JakartaBold text-center">
                Verified
              </Text>
              <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
                You have successfully verified your account.
              </Text>
              <CustomButton
                title="Browse Home"
                onPress={() => router.push(`/(root)/(tabs)/home`)}
                className="mt-5"
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

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
import { Link, router,useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from '@clerk/clerk-expo'

const SignIN = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback( async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password : form.password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }, [isLoaded, form.email, form.password]) 

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
          
          <CustomButton title="Sign In" onPress={onSignInPress} className="mt-5" />
          < OAuth />
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

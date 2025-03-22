import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import icons from "@/constants/icon";
import { useOAuth, useUser } from "@clerk/clerk-expo";
import { googleOAuth } from "@/lib/auth";
import { useClerkSupabaseClient } from "@/lib/clerkSupabase";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  const handleGoogleSignIn = async () => {
    const result = await googleOAuth(startOAuthFlow);
    if (result.success) {
      const clerkUserId = result?.signUp?.createdUserId ?? user?.id;
      const firstName = result?.signUp?.firstName ?? user?.firstName;
      const lastName = result?.signUp?.lastName ?? user?.lastName;
      const email =
        result?.signUp?.emailAddress ?? user?.primaryEmailAddress?.emailAddress;

      if (!clerkUserId) {
        console.error("No Clerk user ID found");
        return;
      }

      try {
        const { data, error } = await supabase.from("tasks").insert({
          user_id: clerkUserId,
          first_name: firstName,
          last_name: lastName,
          email: email,
        });
        if (error) {
          console.error("Supabase insert error:", error);
        } else {
          console.log("Supabase insert success:", data);
        }
      } catch (insertErr) {
        console.error("Supabase insert exception:", insertErr);
      }
    }

    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
    }

    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;

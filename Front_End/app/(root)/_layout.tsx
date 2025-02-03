import { useGlobalContext } from "@/lib/globle-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function AppLayout() {
  const { loading, isLoggedIn, hasCompletedOnboarding } = useGlobalContext();
  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }
  if (!hasCompletedOnboarding) {
    return <Redirect href="/welcome" />;
  }
  if (!isLoggedIn) 
    return <Redirect href='/sign-in' />;

    return <Slot />;
}

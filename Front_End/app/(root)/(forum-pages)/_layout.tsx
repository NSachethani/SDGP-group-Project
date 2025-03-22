import { Stack } from "expo-router";

const ForumLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="Addiction-Help" options={{ headerShown: false }} />
      <Stack.Screen name="Digital-Wellness" options={{ headerShown: false }} />
      <Stack.Screen name="Mindful-Living" options={{ headerShown: false }} />
      <Stack.Screen name="Offline-Bliss" options={{ headerShown: false }} />
      <Stack.Screen name="Technical-Help" options={{ headerShown: false }} />
      <Stack.Screen name="postDetails" options={{ headerShown: false, presentation:"modal" }} />
      <Stack.Screen name="postDetails2" options={{ headerShown: false, presentation:"modal" }} />
      <Stack.Screen name="postDetails3" options={{ headerShown: false, presentation:"modal" }} />
      <Stack.Screen name="postDetails4" options={{ headerShown: false, presentation:"modal" }} />
      <Stack.Screen name="postDetails5" options={{ headerShown: false, presentation:"modal" }} />
    </Stack>
  );
};

export default ForumLayout;

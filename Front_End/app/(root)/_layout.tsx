import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(usage-timer)" options={{ headerShown: false }} />
      <Stack.Screen name="(forum-pages)" options={{ headerShown: false }} />
    </Stack>
  );
  
};


export default Layout;
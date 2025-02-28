import { Stack } from "expo-router";

const TimerLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="usage-limits" options={{ headerShown: false }} />
      <Stack.Screen name="app-timer" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TimerLayout;

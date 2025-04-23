import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (

  <Stack screenOptions={{headerShown: false}}/>

);
}

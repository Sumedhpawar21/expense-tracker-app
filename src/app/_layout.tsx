import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "../context/auth-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const queryClient = new QueryClient();
  const { token, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);
  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />

        <Stack>
          <Stack.Protected guard={!token}>
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/register"
              options={{ headerShown: false }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!!token}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen
              name="(category)/add-category"
              options={{
                title: "Add Category",
                headerBackButtonDisplayMode: "default",
                headerBackTitle: "categories",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#2b7fff" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="(category)/edit-category"
              options={{
                title: "Edit Category",
                headerBackButtonDisplayMode: "default",
                headerBackTitle: "categories",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#2b7fff" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="(transaction)/add-transaction"
              options={{
                title: "Add Transaction",
                headerBackButtonDisplayMode: "default",
                headerBackTitle: "transactions",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#2b7fff" },
                headerTintColor: "#fff",
              }}
            />
            <Stack.Screen
              name="(transaction)/edit-transaction"
              options={{
                title: "Edit Transaction",
                headerBackButtonDisplayMode: "default",
                headerBackTitle: "transactions",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#2b7fff" },
                headerTintColor: "#fff",
              }}
            />
          </Stack.Protected>
        </Stack>
        <Toast position="bottom" autoHide={true} swipeable={true} />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

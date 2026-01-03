import { useAuth } from "@/src/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useRef } from "react";
import { Alert, Animated, Pressable } from "react-native";
export default function TabsLayout() {
  const { signOut } = useAuth();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          signOut();
          router.replace("/login");
        },
      },
    ]);
  };
  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: "#2b7fff" },
          headerTintColor: "#fff",
          headerTitle: "Track Money",
          headerTitleStyle: { fontSize: 18, fontWeight: "600" },
          tabBarActiveTintColor: "#2b7fff",
          tabBarInactiveTintColor: "#9ca3af",
          headerTitleAlign: "center",
          headerRight: () => (
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleLogout}
              style={{ marginRight: 16 }}
            >
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                  padding: 6,
                  borderRadius: 20,
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </Animated.View>
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            headerTitle: "Transactions",
            headerTintColor: "#fff",
            title: "Transactions",
            headerTitleAlign: "left",
            headerRight: () => (
              <Ionicons
                name="add"
                size={26}
                color="#fff"
                style={{ marginRight: 16 }}
                onPress={() => router.push("../(transaction)/add-transaction")}
              />
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="receipt" color={color} size={size} />
            ),
          }}
        />

        <Tabs.Screen
          name="category"
          options={{
            headerTitle: "Category",
            headerTintColor: "#fff",
            title: "Categories",
            headerTitleAlign: "left",
            headerRight: () => (
              <Ionicons
                name="add"
                size={26}
                color="#fff"
                style={{ marginRight: 16 }}
                onPress={() => router.push("../(category)/add-category")}
              />
            ),

            tabBarIcon: ({ color, size }) => (
              <Ionicons name="apps" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

import { Transaction } from "@/src/app/(tabs)/transactions";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  item: Transaction;
  children: React.ReactNode;
  onDelete: (id: string) => void;
};

let currentOpenRow: SwipeableMethods | null = null;

const SwipeableRow = ({ item, children, onDelete }: Props) => {
  const swipeRef = useRef<SwipeableMethods>(null);

  const handleOpen = () => {
    if (currentOpenRow && currentOpenRow !== swipeRef.current) {
      currentOpenRow.close();
    }
    currentOpenRow = swipeRef.current;
  };

  const renderRightActions = (progress: any) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [100, 0]),
        },
      ],
    }));

    return (
      <View style={styles.actionsContainer}>
        {/* EDIT */}
        <Animated.View
          style={[styles.actionButton, styles.editButton, animatedStyle]}
        >
          <TouchableOpacity
            onPress={() => {
              swipeRef.current?.close();
              router.push({
                pathname: "/(transaction)/edit-transaction",
                params: { id: item.id },
              });
            }}
          >
            <Ionicons name="pencil" color={"white"} size={20} />
          </TouchableOpacity>
        </Animated.View>

        {/* DELETE */}
        <Animated.View
          style={[styles.actionButton, styles.deleteButton, animatedStyle]}
        >
          <TouchableOpacity
            onPress={() => {
              swipeRef.current?.close();
              Alert.alert(
                "Delete Transaction",
                "Are you sure you want to delete this?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(String(item.id)),
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash" color={"white"} size={20} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      onSwipeableOpen={handleOpen}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      <View style={styles.rowContainer}>{children}</View>
    </Swipeable>
  );
};

export default SwipeableRow;

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
    borderRadius: 10,
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingLeft: 10,
    paddingRight: 5,
    columnGap: 3,
  },

  actionButton: {
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },

  editButton: {
    backgroundColor: "#3b82f6",
  },

  deleteButton: {
    backgroundColor: "#ef4444",
  },
});

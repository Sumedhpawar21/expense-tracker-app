import { getMonthlyBreakdown } from "@/src/apis/homescreen";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface BreakdownItem {
  categoryColor?: string | null;
  categoryId: number;
  categoryName: string;
  percentage: number;
  totalAmount: number;
}

const CategoryPieChart = () => {
  const { data } = useQuery({
    queryKey: ["monthly-breakdown"],
    queryFn: getMonthlyBreakdown,
  });
  const breakdownData = data || [];

  const pieData = breakdownData.map((item: BreakdownItem) => ({
    value: item.totalAmount,
    color: item.categoryColor,
    text: `${item.percentage} %`,
    textColor: "#fff",
    textSize: 12,
  }));

  return (
    <View
      style={{
        backgroundColor: "#e2e8f0",
        borderRadius: 16,
        padding: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        marginTop: 20,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          textAlign: "center",
          marginBottom: 10,
          color: "#334155",
        }}
      >
        Expense Breakdown
      </Text>

      <PieChart data={pieData} donut radius={120} innerRadius={60} showText />

      <ScrollView style={{ marginTop: 20, width: "100%", maxHeight: 200 }}>
        {breakdownData.map((item: BreakdownItem) => {
          return (
            <View
              key={item.categoryId}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: item.categoryColor || "#000",
                  marginRight: 8,
                }}
              />
              <Text style={{ fontSize: 14, color: "#334155", flex: 1 }}>
                {item.categoryName}
              </Text>
              <Text style={{ fontSize: 14, color: "#475569" }}>
                ₹{item.totalAmount} ({item.percentage}%)
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CategoryPieChart;

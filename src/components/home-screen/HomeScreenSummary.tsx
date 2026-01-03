import { getMonthlySummary } from "@/src/apis/homescreen";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";

type SummaryItemProps = {
  label: string;
  value: number;
  color: string;
};

const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, color }) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ fontSize: 12, color, fontWeight: "500" }}>{label}</Text>
    <Text style={{ fontSize: 18, fontWeight: "700", color }}>₹{value}</Text>
  </View>
);

const HomeScreenSummary: React.FC = () => {
  const { data } = useQuery({
    queryKey: ["homeScreenSummary"],
    queryFn: getMonthlySummary,
  });
  const summaryData = [
    { label: "Credited", value: data?.creditedTotal, color: "#15803d" },
    { label: "Debited", value: data?.debitedTotal, color: "#b91c1c" },
    { label: "Balance", value: data?.balanceTotal, color: "#1d4ed8" },
  ];
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
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "700",
          color: "#334155",
        }}
      >
        {moment().format("MMMM (YYYY)")}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          gap: 20,
        }}
      >
        {summaryData.map((item, index) => (
          <React.Fragment key={index}>
            <SummaryItem {...item} />

            {index !== summaryData.length - 1 && (
              <View
                style={{
                  width: 1,
                  backgroundColor: "#f9fafb",
                  marginHorizontal: 10,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default HomeScreenSummary;

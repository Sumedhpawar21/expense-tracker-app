import CategoryPieChart from "@/src/components/home-screen/CategoryPieChart";
import HomeScreenSummary from "@/src/components/home-screen/HomeScreenSummary";
import TransactionList from "@/src/components/home-screen/TransactionList";
import React from "react";
import { ScrollView } from "react-native";

const Home = () => {
  const credited = 12000;
  const debited = 7500;
  const balance = credited - debited;
  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <HomeScreenSummary
      />
      <CategoryPieChart />
      <TransactionList />
    </ScrollView>
  );
};

export default Home;

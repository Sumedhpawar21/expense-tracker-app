import { getRecentTransactions } from "@/src/apis/homescreen";
import { deleteTransaction } from "@/src/apis/transaction";
import { Transaction } from "@/src/app/(tabs)/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";
import moment from "moment";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import SwipeableRow from "../common/SwipeAbleRow";

const TransactionList = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: getRecentTransactions,
  });
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Transaction deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["recent-transactions"] });
    },
  });
  function handleDelete(id: string) {
    deleteMutation(Number(id));
  }

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
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Recent Transactions
        </Text>

        <Link
          href={"/(transaction)/add-transaction"}
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#1d4ed8",
          }}
        >
          Add Transaction
        </Link>
      </View>

      <FlatList<Transaction>
        data={data}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <SwipeableRow item={item} onDelete={handleDelete}>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderColor: "#cbd5e1",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: item.category.categoryColor,
                  marginRight: 12,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  {item.transactionTitle}
                </Text>

                <Text style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {item.category.categoryTitle} •{" "}
                  {moment(item.createdAt).format("DD MMM, YYYY")}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color:
                    item.transactionType === "EXPENSE" ? "#ef4444" : "#22c55e",
                }}
              >
                {item.transactionType === "EXPENSE"
                  ? `-₹${Math.abs(item.transactionAmount)}`
                  : `+₹${item.transactionAmount}`}
              </Text>
            </TouchableOpacity>
          </SwipeableRow>
        )}
      />
      <Link
        href={"/(tabs)/transactions"}
        style={{
          fontSize: 13,
          textAlign: "right",
          marginTop: 14,
          color: "#1d4ed8",
        }}
      >
        view more
      </Link>
    </View>
  );
};

export default TransactionList;

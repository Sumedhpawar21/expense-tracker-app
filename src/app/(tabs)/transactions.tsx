import { getCategories } from "@/src/apis/category";
import { deleteTransaction, getTransactions } from "@/src/apis/transaction";
import DropdownComponent from "@/src/components/common/Dropdown";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import moment from "moment";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export interface Transaction {
  id: number;
  transactionTitle: string;
  transactionDescription?: string;
  transactionType: "INCOME" | "EXPENSE";
  transactionAmount: number;
  categoryId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  category: {
    id: number;
    categoryTitle: string;
    categoryDescription?: string;
    categoryColor?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  };
}
export interface GetTransactionsResponse {
  transactions: Transaction[];
  page: number;
  totalPages: number;
}
const Transactions = () => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "INCOME" | "EXPENSE" | undefined
  >(undefined);

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<GetTransactionsResponse>({
    initialPageParam: 1,
    queryKey: [
      "transaction",
      search,
      selectedTransactionType,
      selectedCategory,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getTransactions(
        Number(pageParam),
        50,
        search,
        selectedTransactionType,
        Number(selectedCategory)
      ),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage?.totalPages as number;
      const currentPage = lastPage?.page as number;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
  const { data: categoryData } = useQuery({
    queryKey: ["categories-dropdown"],
    queryFn: () => getCategories(1, 100, ""),
  });
  const categoryOptions =
    categoryData?.categories?.map((cat: any) => ({
      label: cat.categoryTitle,
      value: String(cat.id),
    })) ?? [];
  const transactions: Transaction[] =
    data?.pages.flatMap((page) => page.transactions) ?? [];
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const formatAmount = (amount: number, type: "INCOME" | "EXPENSE") => {
    const sign = type === "EXPENSE" ? "-" : "+";
    return `${sign}₹${Math.abs(amount)}`;
  };
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      onRefresh();
      Toast.show({
        type: "success",
        text1: "Transaction deleted successfully",
      });
    },
  });
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f8fafc" }}>
      <TextInput
        placeholder="Search Transactions"
        placeholderTextColor="#6b7280"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 0.5,
          borderColor: "#d1d5db",
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          fontSize: 16,
          marginBottom: 16,
          backgroundColor: "#fff",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          marginVertical: 8,
        }}
      >
        <View style={{ width: "48%" }}>
          <DropdownComponent
            label="Category"
            data={categoryOptions}
            defaultLabel="All Categories"
            defaultValue={selectedCategory}
            onChange={(value) => setSelectedCategory(value)}
          />
        </View>
        <View style={{ width: "48%" }}>
          <DropdownComponent
            label="Type"
            data={[
              { label: "Income", value: "INCOME" },
              { label: "Expense", value: "EXPENSE" },
            ]}
            defaultLabel="All Types"
            defaultValue={selectedTransactionType}
            onChange={(value) =>
              setSelectedTransactionType(
                value as "INCOME" | "EXPENSE" | undefined
              )
            }
          />
        </View>
      </View>
      {isLoading && !isFetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList<Transaction>
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => {
            return (
              <Text
                style={{
                  color: "#6c757d",
                  textAlign: "center",
                  marginTop: 20,
                }}
              >
                No Transactions Found
              </Text>
            );
          }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: item.category.categoryColor || "#6b7280",
                    marginRight: 12,
                  }}
                />

                <View style={{ flexShrink: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#0f172a",
                      marginBottom: 4,
                    }}
                  >
                    {item.transactionTitle}
                  </Text>
                  {item.transactionDescription ? (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        marginBottom: 4,
                      }}
                    >
                      {item.transactionDescription
                        .split(" ")
                        .reduce(
                          (acc, word, index) =>
                            index % 4 === 0
                              ? acc + (index === 0 ? "" : "\n") + word
                              : acc + " " + word,
                          ""
                        )}
                    </Text>
                  ) : null}

                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                    {moment(item.createdAt).format("DD MMM YYYY")} •{" "}
                    {item.category.categoryTitle}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  alignItems: "flex-end",
                  flexDirection: "row",
                  gap: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color:
                      item.transactionType === "EXPENSE"
                        ? "#ef4444"
                        : "#22c55e",
                    marginRight: 8,
                  }}
                >
                  {formatAmount(item.transactionAmount, item.transactionType)}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "../(transaction)/edit-transaction",
                      params: { id: item.id },
                    })
                  }
                >
                  <Ionicons name="pencil" color={"green"} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Delete Transaction",
                      "Are you sure you want to delete this transaction?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => deleteMutation(item.id),
                        },
                      ]
                    )
                  }
                >
                  <Ionicons name="trash" color={"red"} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Transactions;

import { deleteCategory, getCategories } from "@/src/apis/category";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
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

const Category = () => {
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: categories,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["category", search],
    queryFn: ({ pageParam = 1 }) => getCategories(pageParam, 50, search),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage?.totalPages as number;
      const currentPage = lastPage?.page as number;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

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
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      onRefresh();
      Toast.show({
        type: "success",
        text1: "Category deleted successfully",
      });
    },
  });
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        placeholder="Search category"
        placeholderTextColor="#6c757d"
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 0.3,
          borderColor: "#6c757d",
          borderRadius: 8,
          paddingHorizontal: 14,
          fontSize: 16,
          paddingVertical: 14,
          marginBottom: 16,
        }}
      />
      {isLoading && !isFetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={categories?.pages?.flatMap((page) => page.categories) || []}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
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
                No Categories Found
              </Text>
            );
          }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                paddingHorizontal: 16,
                paddingVertical: 16,
                borderRadius: 12,
                marginBottom: 12,
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: item.categoryColor,
                    marginRight: 12,
                  }}
                />
                <View style={{ flexShrink: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    {item.categoryTitle}
                  </Text>
                  {item.categoryDescription ? (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6c757d",
                        marginTop: 2,
                      }}
                    >
                      {item.categoryDescription}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "../(category)/edit-category",
                      params: { id: item.id },
                    })
                  }
                >
                  <Ionicons name="pencil" color={"green"} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      "Delete Category",
                      "Are you sure you want to delete this category?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            deleteMutation(item.id);
                          },
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
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color="#007bff" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default Category;

import { getCategories } from "@/src/apis/category";
import { addTransaction } from "@/src/apis/transaction";
import DropdownComponent from "@/src/components/common/Dropdown";
import { createTransactionSchema } from "@/src/validators/transaction-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

const AddTransaction = () => {
  const router = useRouter();
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "INCOME"
  );
  const [category, setCategory] = useState<number | undefined>(undefined);

  const { data: categoryData } = useQuery({
    queryKey: ["categories-dropdown"],
    queryFn: () => getCategories(1, 100, ""),
  });

  const categoryOptions =
    categoryData?.categories?.map((cat: any) => ({
      label: cat.categoryTitle,
      value: String(cat.id),
    })) ?? [];
  const form = useForm<z.infer<typeof createTransactionSchema>>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      transaction_title: "",
      transaction_description: "",
      transaction_type: transactionType,
      transaction_amount: undefined,
      category_id: category ?? undefined,
    },
  });

  useEffect(() => {
    form.setValue("transaction_type", transactionType);
  }, [transactionType]);

  useEffect(() => {
    if (category !== undefined) form.setValue("category_id", category);
  }, [category]);

  const { mutate: addTransactionMutation, isPending: addTransactionPending } =
    useMutation({
      mutationFn: addTransaction,
      onSuccess: () => {
        router.push("/transactions");
        Toast.show({
          type: "success",
          text1: "Transaction added successfully",
        });
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: "Failed to add transaction",
          text2: err?.message || "Something went wrong",
        });
      },
    });

  const onSubmit = (data: z.infer<typeof createTransactionSchema>) => {
    addTransactionMutation({
      transaction_title: data.transaction_title,
      transaction_description: data.transaction_description,
      transaction_type: data.transaction_type,
      transaction_amount: data.transaction_amount,
      category_id: data.category_id,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
              Transaction Title
            </Text>
            <Controller
              control={form.control}
              name="transaction_title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter title"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    fontSize: 14,
                  }}
                />
              )}
            />
            {form.formState.errors.transaction_title && (
              <Text style={{ color: "red", marginTop: 8 }}>
                {form.formState.errors.transaction_title.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
              Description
            </Text>
            <Controller
              control={form.control}
              name="transaction_description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Optional description"
                  placeholderTextColor="#9ca3af"
                  multiline
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    height: 120,
                    textAlignVertical: "top",
                    fontSize: 14,
                  }}
                />
              )}
            />
            {form.formState.errors.transaction_description && (
              <Text style={{ color: "red", marginTop: 8 }}>
                {form.formState.errors.transaction_description.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
              Transaction Type
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 8,
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              {["INCOME", "EXPENSE"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() =>
                    setTransactionType(type as "INCOME" | "EXPENSE")
                  }
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    alignItems: "center",
                    backgroundColor:
                      transactionType === type ? "#2563eb" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: transactionType === type ? "#fff" : "#0f172a",
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
              Amount
            </Text>
            <Controller
              control={form.control}
              name="transaction_amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter amount"
                  value={value !== undefined ? String(value) : ""}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const sanitized = text.replace(/[^0-9.]/g, "");
                    const numericValue = parseFloat(sanitized);
                    onChange(isNaN(numericValue) ? undefined : numericValue);
                  }}
                  style={{
                    marginTop: 8,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    fontSize: 14,
                  }}
                />
              )}
            />
            {form.formState.errors.transaction_amount && (
              <Text style={{ color: "red", marginTop: 8 }}>
                {form.formState.errors.transaction_amount.message}
              </Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <DropdownComponent
              label="Category"
              data={categoryOptions}
              defaultLabel="Select Category"
              defaultValue={category?.toString()}
              onChange={(value: number) => {
                setCategory(Number(value));
              }}
            />
            {form.formState.errors.category_id && (
              <Text style={{ color: "red", marginTop: 8 }}>
                {form.formState.errors.category_id.message}
              </Text>
            )}
          </View>
        </ScrollView>

        <Pressable
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            right: 24,
            backgroundColor: "#2563eb",
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: "center",
            opacity: addTransactionPending ? 0.8 : 1,
          }}
          disabled={addTransactionPending}
          onPress={() => form.handleSubmit(onSubmit)()}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            Save Transaction
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTransaction;

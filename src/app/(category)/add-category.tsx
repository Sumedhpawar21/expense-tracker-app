import { addCategory } from "@/src/apis/category";
import { addCategoryValidator } from "@/src/validators/category-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import ColorPicker from "react-native-wheel-color-picker";
import z from "zod";

const AddCategory = () => {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  const form = useForm<z.infer<typeof addCategoryValidator>>({
    resolver: zodResolver(addCategoryValidator),
    defaultValues: {
      category_title: "",
      category_description: "",
      category_color: selectedColor,
    },
  });

  useEffect(() => {
    form.setValue("category_color", selectedColor);
  }, [selectedColor]);

  const { mutate: addCategoryMutation, isPending: addCategoryPending } =
    useMutation({
      mutationFn: addCategory,
      onSuccess: () => {
        router.push("/category");
        Toast.show({
          type: "success",
          text1: "Category added successfully",
        });
      },
    });
  const onSubmit = (data: z.infer<typeof addCategoryValidator>) => {
    addCategoryMutation({
      category_title: data.category_title,
      category_description: data.category_description,
      category_color: selectedColor,
    });
  };

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#f8fafc" }}>
      <View style={{ flex: 1, gap: 20 }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
            Category Title
          </Text>
          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Category Title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
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
            name="category_title"
            rules={{ required: true }}
          />
          {form.formState.errors.category_title && (
            <Text style={{ color: "red", marginVertical: 8 }}>
              {form.formState.errors.category_title.message}
            </Text>
          )}
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
            Category Description
          </Text>
          <Controller
            control={form.control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Optional description"
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={{
                  marginTop: 8,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  height: 100,
                  textAlignVertical: "top",
                  fontSize: 14,
                }}
              />
            )}
            name="category_description"
            rules={{ required: false }}
          />
          {form.formState.errors.category_description && (
            <Text>{form.formState.errors.category_description.message}</Text>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#0f172a" }}>
            Choose Color
          </Text>

          <View
            style={{
              marginTop: 12,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 6,
              flex: 1,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: selectedColor,
                marginBottom: 20,
                borderWidth: 2,
                borderColor: "#e2e8f0",
              }}
            />

            <View style={{ flex: 1 }}>
              <ColorPicker
                color={selectedColor}
                onColorChange={setSelectedColor}
                thumbSize={28}
                sliderSize={28}
                row={false}
                noSnap={true}
                swatches={false}
              />
            </View>
          </View>
        </View>
      </View>

      <Pressable
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 16,
          opacity: addCategoryPending ? 0.8 : 1,
        }}
        disabled={addCategoryPending}
        onPress={form.handleSubmit(onSubmit)}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Save Category
        </Text>
      </Pressable>
    </View>
  );
};

export default AddCategory;

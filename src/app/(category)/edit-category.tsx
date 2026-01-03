import { editCategory, getCategoryById } from "@/src/apis/category";
import { editCategoryValidator } from "@/src/validators/category-validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import ColorPicker from "react-native-wheel-color-picker";
import z from "zod";

const EditCategory = () => {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id?: string }>();

  const { data: category } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id!),
    enabled: !!id,
  });

  const form = useForm<z.infer<typeof editCategoryValidator>>({
    resolver: zodResolver(editCategoryValidator),
    defaultValues: {
      category_title: "",
      category_description: "",
      category_color: "#000000",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        category_title: category.categoryTitle ?? "",
        category_description: category.categoryDescription ?? "",
        category_color: category.categoryColor ?? "#000000",
      });
    }
  }, [category]);

  const watchedColor = form.watch("category_color");
  const { mutate: editCategoryMutation, isPending: editCategoryPending } =
    useMutation({
      mutationFn: editCategory,
      onSuccess: () => {
        router.push("/category");
        Toast.show({
          type: "success",
          text1: "Category updated successfully",
        });
      },
    });
  const onSubmit = (data: z.infer<typeof editCategoryValidator>) => {
    editCategoryMutation({
      category_title: data.category_title,
      category_description: data.category_description,
      category_color: watchedColor,
      category_id: id!,
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
            name="category_title"
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
          />
          {form.formState.errors.category_title && (
            <Text style={{ color: "red", marginTop: 8 }}>
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
            name="category_description"
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
          />
          {form.formState.errors.category_description && (
            <Text style={{ color: "red", marginTop: 8 }}>
              {form.formState.errors.category_description.message}
            </Text>
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
                backgroundColor: watchedColor,
                marginBottom: 20,
                borderWidth: 2,
                borderColor: "#e2e8f0",
              }}
            />

            <View style={{ flex: 1 }}>
              <Controller
                control={form.control}
                name="category_color"
                render={({ field: { onChange, value } }) => (
                  <ColorPicker
                    color={value}
                    onColorChange={onChange}
                    thumbSize={28}
                    sliderSize={28}
                    row={false}
                    noSnap
                    swatches={false}
                  />
                )}
              />
              {form.formState.errors.category_color && (
                <Text style={{ color: "red", marginTop: 8 }}>
                  {form.formState.errors.category_color.message}
                </Text>
              )}
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
          opacity: editCategoryPending ? 0.8 : 1,
        }}
        onPress={form.handleSubmit(onSubmit)}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Edit Category
        </Text>
      </Pressable>
    </View>
  );
};

export default EditCategory;

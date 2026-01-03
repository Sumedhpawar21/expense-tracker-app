import { register } from "@/src/apis/auth";
import { useAuth } from "@/src/context/auth-context";
import { registerSchema } from "@/src/validators/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

export default function Register() {
  const router = useRouter();
  const { signIn } = useAuth();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email_id: "",
      password: "",
    },
  });
  const { mutate: registerMutation, isPending: registerPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      router.push("/(tabs)");
      signIn(data.token);
      Toast.show({
        type: "success",
        text1: `Welcome ${data.user.fullName}`,
      });
    },
  });
  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    registerMutation({
      full_name: data.full_name,
      email_id: data.email_id,
      password: data.password,
    });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Welcome to Budgy</Text>
        <Text style={styles.heroSubtitle}>
          Manage your finances, track your spending efficiently
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              keyboardType="default"
              autoCapitalize="none"
              onBlur={onBlur}
            />
          )}
          name="full_name"
          rules={{ required: true }}
        />
        {form.formState.errors.full_name && (
          <Text style={{ color: "red", marginVertical: 8 }}>
            {form.formState.errors.full_name.message}
          </Text>
        )}
        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
            />
          )}
          name="email_id"
          rules={{ required: true }}
        />
        {form.formState.errors.email_id && (
          <Text style={{ color: "red", marginVertical: 8 }}>
            {form.formState.errors.email_id.message}
          </Text>
        )}

        <Controller
          control={form.control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
            />
          )}
          name="password"
          rules={{ required: true }}
        />
        {form.formState.errors.password && (
          <Text style={{ color: "red", marginVertical: 8 }}>
            {form.formState.errors.password.message}
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            registerPending && { backgroundColor: "#aaa" },
          ]}
          disabled={registerPending}
          onPress={form.handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>
            {registerPending ? "Registering..." : "Register"}
          </Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Already have an account?{" "}
            <Link href="/(auth)/login" style={styles.registerLink}>
              Login
            </Link>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b7fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  hero: {
    marginBottom: 50,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e0f0ff",
    textAlign: "center",
    marginTop: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#2b7fff",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2b7fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  registerText: {
    fontSize: 14,
    color: "#666",
  },

  registerLink: {
    color: "#2b7fff",
    fontWeight: "bold",
  },
});

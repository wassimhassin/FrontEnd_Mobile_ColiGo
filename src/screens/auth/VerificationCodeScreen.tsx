import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button } from "../../components/ui";
import { authService } from "../../services/authService";

interface VerificationCodeScreenProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const VerificationCodeScreen: React.FC<VerificationCodeScreenProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (pastedText: string, index: number) => {
    // Clean and validate pasted text
    const cleanedText = pastedText.replace(/\D/g, ""); // Remove non-digits

    if (cleanedText.length === 6) {
      // Valid 6-digit code pasted
      const digits = cleanedText.split("");
      setCode(digits);
      setError("");

      // Focus last input to show completion
      inputRefs.current[5]?.focus();

      // Auto-verify after a short delay to show the filled code
      setTimeout(() => {
        handleVerify(digits.join(""));
      }, 300);
    } else if (cleanedText.length > 0) {
      // Partial paste - fill from current index
      const newCode = [...code];
      const digits = cleanedText.split("");

      for (let i = 0; i < digits.length && index + i < 6; i++) {
        newCode[index + i] = digits[i];
      }

      setCode(newCode);
      setError("");

      // Focus next empty input or last input
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join("");

    if (codeToVerify.length !== 6) {
      setError("Veuillez entrer le code complet");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.verifyCode(codeToVerify);

      if (result.success) {
        Alert.alert(
          "Vérification réussie ! 🎉",
          "Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.",
          [
            {
              text: "OK",
              onPress: onSuccess,
            },
          ],
        );
      } else {
        setError(result.message || "Code de vérification invalide");
        // Clear the code inputs
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) {
      return; // Still in cooldown
    }

    setIsResending(true);
    setError("");

    try {
      const result = await authService.resendCode(email);

      if (result.success) {
        Alert.alert(
          "Code renvoyé ! 📧",
          "Un nouveau code de vérification a été envoyé à votre adresse email.",
          [{ text: "OK" }],
        );
        setResendCooldown(60); // 60 second cooldown
      } else {
        setError(result.message || "Impossible de renvoyer le code");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi du code. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center pt-12 pb-8"
          >
            <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="mail-outline" size={48} color="#3b82f6" />
            </View>

            <Text className="text-3xl font-bold text-gray-800 mb-2 text-center">
              Vérifiez votre email
            </Text>
            <Text className="text-gray-500 text-base text-center px-6">
              Nous avons envoyé un code de vérification à{"\n"}
              <Text className="font-semibold text-gray-700">{email}</Text>
            </Text>
          </Animated.View>

          {/* Code Input */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            className="px-6"
          >
            <View className="flex-row justify-center mb-6">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onChange={(e) => {
                    const text = e.nativeEvent.text;
                    if (text && text.length > 1) {
                      handlePaste(text, index);
                    }
                  }}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  className={`w-12 h-14 mx-1 text-center text-2xl font-bold border-2 rounded-xl ${
                    error
                      ? "border-red-500 bg-red-50"
                      : digit
                        ? "border-primary-600 bg-primary-50"
                        : "border-gray-200 bg-white"
                  }`}
                  style={{ color: error ? "#ef4444" : "#1f2937" }}
                />
              ))}
            </View>

            {/* Error Message */}
            {error ? (
              <Animated.View
                entering={FadeInUp.duration(300)}
                className="flex-row items-center justify-center mb-4 bg-red-50 rounded-xl p-3"
              >
                <Ionicons name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-red-600 ml-2">{error}</Text>
              </Animated.View>
            ) : null}

            {/* Info Card */}
            <View className="bg-blue-50 rounded-xl p-4 mb-6 flex-row">
              <Ionicons name="information-circle" size={24} color="#3b82f6" />
              <View className="flex-1 ml-3">
                <Text className="text-blue-800 font-medium mb-1">
                  Code à 6 chiffres
                </Text>
                <Text className="text-blue-600 text-sm">
                  Saisissez le code de vérification que vous avez reçu par
                  email. Le code expire après 24 heures.
                </Text>
              </View>
            </View>

            {/* Verify Button */}
            <Button
              title="Vérifier le code"
              onPress={handleVerify}
              loading={isLoading}
              disabled={code.join("").length !== 6}
              icon={<Ionicons name="checkmark-circle" size={20} color="#fff" />}
              iconPosition="right"
            />

            {/* Resend Code */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-500">
                Vous n'avez pas reçu le code ?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resendCooldown > 0 || isResending}
              >
                <Text
                  className={`font-semibold ${
                    resendCooldown > 0 || isResending
                      ? "text-gray-400"
                      : "text-primary-600"
                  }`}
                >
                  {isResending
                    ? "Envoi..."
                    : resendCooldown > 0
                      ? `Renvoyer (${resendCooldown}s)`
                      : "Renvoyer"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

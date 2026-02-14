import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button, Input } from "../../components/ui";
import { useAppStore, useAuthStore } from "../../store";
import { UserRole, USER_ROLES, VALIDATION } from "../../constants";
import { VerificationCodeScreen } from "./VerificationCodeScreen";

interface RegisterScreenProps {
  onLogin: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleName: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  roleName?: string;
}

const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <View className="flex-row items-center justify-center mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 <= currentStep;

        return (
          <React.Fragment key={index}>
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isActive ? "bg-primary-600" : "bg-gray-200"
              }`}
            >
              {index + 1 < currentStep ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text
                  className={`font-semibold ${isActive ? "text-white" : "text-gray-500"}`}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            {index < totalSteps - 1 && (
              <View
                className={`w-12 h-1 mx-1 rounded ${
                  index + 1 < currentStep ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onLogin,
  onBack,
  onSuccess,
}) => {
  const { selectedRole } = useAppStore();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Fonction utilitaire pour mapper le rôle interne vers le rôle API (si différent)
  const getApiRoleName = (appRole: UserRole | null): string => {
    if (appRole === USER_ROLES.CLIENT) return "CLIENT";
    return "LIVREUR";
  };

  console.log(
    "selectedRole",
    getApiRoleName(selectedRole),
    "----------------------",
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "",
  });
  console.log("form data", formData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: undefined });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    }
    // if (!formData.address.trim()) {
    //   newErrors.address = "L'adresse est requise";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!VALIDATION.EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Minimum ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmez le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    clearError();

    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      // Données envoyées au backend
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.replace(/\s/g, ""),
        address: formData.address,
        roleName: formData.roleName || getApiRoleName(selectedRole),
      };

      const success = await register(registrationData);
      console.log("success", registrationData, "----------------------");
      if (success) {
        // Navigate to verification screen
        setRegisteredEmail(formData.email.trim().toLowerCase());
        setShowVerification(true);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleVerificationSuccess = () => {
    // After successful verification, redirect to home
    onSuccess();
  };

  const handleVerificationBack = () => {
    // Allow user to go back to registration form
    setShowVerification(false);
  };

  // Show error alert if there's an API error
  React.useEffect(() => {
    if (error) {
      Alert.alert("Erreur", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  // Update role if selectedRole changes in store (unlikely but safe)
  React.useEffect(() => {
    if (selectedRole) {
      setFormData((prev) => ({
        ...prev,
        roleName: getApiRoleName(selectedRole),
      }));
    }
  }, [selectedRole]);

  // If verification screen should be shown
  if (showVerification) {
    return (
      <VerificationCodeScreen
        email={registeredEmail}
        onSuccess={handleVerificationSuccess}
        onBack={handleVerificationBack}
      />
    );
  }

  // Display label for role
  const getRoleLabel = () => {
    if (selectedRole === USER_ROLES.CLIENT) return "CLIENT";
    return "LIVREUR";
  };

  const getRoleIcon = () => {
    if (selectedRole === USER_ROLES.CLIENT) return "airplane-outline";
    return "person-outline";
  };

  // Otherwise show the registration form
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
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                onPress={handleBack}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="#374151" />
              </TouchableOpacity>

              {/* Badge Rôle Dynamique */}
              <View
                style={{ backgroundColor: "#3b82f615" }}
                className="flex-row items-center px-3 py-1.5 rounded-full"
              >
                <Ionicons name={getRoleIcon()} size={16} color="#3b82f6" />
                <Text
                  style={{ color: "#3b82f6" }}
                  className="font-medium ml-1.5 text-sm"
                >
                  {getRoleLabel()}
                </Text>
              </View>
            </View>

            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={2} />

            {/* Title */}
            <Animated.View entering={FadeInDown.duration(400)}>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {step === 1
                  ? "Informations personnelles"
                  : "Créer votre compte"}
              </Text>
              <Text className="text-gray-500 text-base mb-8">
                {step === 1
                  ? "Commençons par vos informations de base"
                  : "Définissez vos identifiants de connexion"}
              </Text>
            </Animated.View>
          </View>

          {/* Form */}
          <View className="px-6 flex-1">
            {step === 1 ? (
              <Animated.View entering={FadeInUp.duration(400)} key="step1">
                <View className="flex-row">
                  <View className="flex-1 mr-2">
                    <Input
                      label="Prénom"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChangeText={(text) => updateForm("firstName", text)}
                      error={errors.firstName}
                      autoCapitalize="words"
                    />
                  </View>
                  <View className="flex-1 ml-2">
                    <Input
                      label="Nom"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChangeText={(text) => updateForm("lastName", text)}
                      error={errors.lastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                <Input
                  label="Téléphone"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChangeText={(text) => updateForm("phone", text)}
                  error={errors.phone}
                  leftIcon="call-outline"
                  keyboardType="phone-pad"
                />
                <Input
                  label="Adresse"
                  placeholder="votre adresse"
                  value={formData.address}
                  onChangeText={(text) => updateForm("address", text)}
                  error={errors.address}
                  leftIcon="location-outline"
                  keyboardType="default"
                  autoCapitalize="words"
                  autoComplete="address-line1"
                />

                {/* Info Card */}
                <View className="bg-blue-50 rounded-xl p-4 mt-4 flex-row">
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color="#3b82f6"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-blue-800 font-medium mb-1">
                      Vérification email requise
                    </Text>
                    <Text className="text-blue-600 text-sm">
                      Après l'inscription, vous recevrez un code de vérification
                      par email pour activer votre compte.
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp.duration(400)} key="step2">
                <Input
                  label="Email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChangeText={(text) => updateForm("email", text)}
                  error={errors.email}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <Input
                  label="Mot de passe"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(text) => updateForm("password", text)}
                  error={errors.password}
                  leftIcon="lock-closed-outline"
                  isPassword
                  hint="Minimum 8 caractères"
                />

                <Input
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateForm("confirmPassword", text)}
                  error={errors.confirmPassword}
                  leftIcon="lock-closed-outline"
                  isPassword
                />

                {/* Password Strength */}
                {formData.password.length > 0 && (
                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-gray-500 text-sm">
                        Force du mot de passe:
                      </Text>
                      <Text
                        className={`ml-2 text-sm font-medium ${
                          formData.password.length >= 12
                            ? "text-green-600"
                            : formData.password.length >= 8
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {formData.password.length >= 12
                          ? "Fort"
                          : formData.password.length >= 8
                            ? "Moyen"
                            : "Faible"}
                      </Text>
                    </View>
                    <View className="flex-row h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className={`h-full rounded-full ${
                          formData.password.length >= 12
                            ? "bg-green-500 w-full"
                            : formData.password.length >= 8
                              ? "bg-yellow-500 w-2/3"
                              : "bg-red-500 w-1/3"
                        }`}
                      />
                    </View>
                  </View>
                )}
              </Animated.View>
            )}
          </View>

          {/* Bottom Section */}
          <View className="px-6 pb-8">
            <Button
              title={step === 1 ? "Continuer" : "Créer mon compte"}
              onPress={handleNext}
              loading={isLoading}
              icon={
                <Ionicons
                  name={step === 1 ? "arrow-forward" : "checkmark"}
                  size={20}
                  color="#fff"
                />
              }
              iconPosition="right"
            />

            {step === 2 && (
              <View className="flex-row justify-center items-center mt-6">
                <Text className="text-gray-500">Déjà un compte ? </Text>
                <TouchableOpacity onPress={onLogin}>
                  <Text className="text-primary-600 font-semibold">
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

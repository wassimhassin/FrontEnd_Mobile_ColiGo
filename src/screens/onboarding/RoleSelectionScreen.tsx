import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Button, Logo } from "../../components/ui";
import { USER_ROLES, UserRole } from "../../constants";

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

interface RoleCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  features: string[];
  selected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  role,
  title,
  description,
  icon,
  features,
  selected,
  onSelect,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(selected ? "#3b82f6" : "#e5e7eb", {
      duration: 200,
    }),
    backgroundColor: withTiming(selected ? "#eff6ff" : "#ffffff", {
      duration: 200,
    }),
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(selected ? 1 : 0, { duration: 200 }),
    transform: [{ scale: withSpring(selected ? 1 : 0.5) }],
  }));

  return (
    <TouchableOpacity
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[animatedStyle, borderAnimatedStyle]}
        className="rounded-2xl border-2 p-5 mb-4"
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center flex-1">
            <View
              className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
                selected ? "bg-primary-600" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={icon}
                size={28}
                color={selected ? "#fff" : "#6b7280"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800">{title}</Text>
              <Text className="text-gray-500 text-sm mt-0.5">
                {description}
              </Text>
            </View>
          </View>

          <Animated.View
            style={checkAnimatedStyle}
            className="w-6 h-6 bg-primary-600 rounded-full items-center justify-center"
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
          </Animated.View>
        </View>

        {/* Features */}
        <View className="mt-4 pt-4 border-t border-gray-100">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={selected ? "#3b82f6" : "#9ca3af"}
              />
              <Text
                className={`ml-2 text-sm ${
                  selected ? "text-gray-700" : "text-gray-500"
                }`}
              >
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onSelectRole,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    {
      role: USER_ROLES.CLIENT,
      title: "Client",
      description: "Je veux envoyer des colis",
      icon: "person-outline" as keyof typeof Ionicons.glyphMap,
      features: [
        "Rechercher des transporteurs",
        "Réserver et suivre vos colis",
        "Paiement sécurisé",
        "Notation des transporteurs",
      ],
    },
    {
      role: USER_ROLES.TRANSPORTER,
      title: "Transporteur",
      description: "Je veux transporter des colis",
      icon: "airplane-outline" as keyof typeof Ionicons.glyphMap,
      features: [
        "Publier vos voyages",
        "Recevoir des réservations",
        "Gérer votre tarification",
        "Recevoir vos paiements",
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-6"
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Qui êtes-vous ?
          </Text>
          <Text className="text-gray-500 text-base">
            Choisissez votre profil pour personnaliser votre expérience
          </Text>
        </View>
      </View>

      {/* Role Cards */}
      <View className="flex-1 px-6">
        {roles.map((item) => (
          <RoleCard
            key={item.role}
            {...item}
            selected={selectedRole === item.role}
            onSelect={() => setSelectedRole(item.role)}
          />
        ))}
      </View>

      {/* Continue Button */}
      <View className="px-6 pb-8">
        <Button
          title="Continuer"
          onPress={() => selectedRole && onSelectRole(selectedRole)}
          disabled={!selectedRole}
          icon={<Ionicons name="arrow-forward" size={20} color="#fff" />}
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
};

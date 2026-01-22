import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Button, Input, Logo } from '../../components/ui';
import { VALIDATION } from '../../constants';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  onBack,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
      newErrors.email = 'Email invalide';
    }

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      newErrors.password = `Minimum ${VALIDATION.PASSWORD_MIN_LENGTH} caractères`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validate()) {
      onLogin(email, password);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          {/* Logo & Title */}
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center pt-8 pb-10"
          >
            <Logo size="md" animated />
            <Text className="text-gray-500 text-base mt-4">
              Content de vous revoir !
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600).springify()}
            className="px-6"
          >
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              leftIcon="lock-closed-outline"
              isPassword
              autoComplete="password"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={onForgotPassword}
              className="self-end mb-6"
            >
              <Text className="text-primary-600 font-medium">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              title="Se connecter"
              onPress={handleLogin}
              loading={isLoading}
              icon={<Ionicons name="log-in-outline" size={20} color="#fff" />}
              iconPosition="right"
            />

            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-400 text-sm">ou continuer avec</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Social Login */}
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity className="w-14 h-14 bg-gray-50 rounded-xl items-center justify-center border border-gray-200">
                <Ionicons name="logo-google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-gray-50 rounded-xl items-center justify-center border border-gray-200 mx-4">
                <Ionicons name="logo-apple" size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity className="w-14 h-14 bg-gray-50 rounded-xl items-center justify-center border border-gray-200">
                <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Register Link */}
          <View className="flex-1 justify-end pb-8 px-6">
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500">Pas encore de compte ? </Text>
              <TouchableOpacity onPress={onRegister}>
                <Text className="text-primary-600 font-semibold">S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

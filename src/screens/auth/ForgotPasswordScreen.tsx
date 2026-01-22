import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
} from 'react-native-reanimated';
import { Button, Input } from '../../components/ui';
import { VALIDATION } from '../../constants';

interface ForgotPasswordScreenProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!VALIDATION.EMAIL_REGEX.test(email)) {
      setError('Email invalide');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(email);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        
        <View className="flex-1 px-6 justify-center items-center">
          <Animated.View
            entering={FadeInDown.duration(600).springify()}
            className="items-center"
          >
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="mail-open" size={48} color="#22c55e" />
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 text-center mb-3">
              Email envoyé !
            </Text>
            
            <Text className="text-gray-500 text-center text-base mb-8 px-4">
              Nous avons envoyé un lien de réinitialisation à{'\n'}
              <Text className="font-semibold text-gray-700">{email}</Text>
            </Text>

            <View className="bg-amber-50 rounded-xl p-4 flex-row mb-8">
              <Ionicons name="time-outline" size={20} color="#f59e0b" />
              <Text className="flex-1 text-amber-700 text-sm ml-3">
                Le lien expire dans 30 minutes. Vérifiez aussi vos spams.
              </Text>
            </View>

            <Button
              title="Retour à la connexion"
              onPress={onBack}
              variant="primary"
            />

            <TouchableOpacity
              onPress={() => setIsSubmitted(false)}
              className="mt-4"
            >
              <Text className="text-primary-600 font-medium">
                Renvoyer l'email
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
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

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          <Animated.View entering={FadeInDown.duration(400)}>
            <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="key" size={32} color="#3b82f6" />
            </View>
            
            <Text className="text-3xl font-bold text-gray-800 mb-3">
              Mot de passe oublié ?
            </Text>
            
            <Text className="text-gray-500 text-base mb-8">
              Pas de problème ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(400)}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              error={error}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoFocus
            />
          </Animated.View>
        </View>

        {/* Bottom */}
        <View className="px-6 pb-8">
          <Button
            title="Envoyer le lien"
            onPress={handleSubmit}
            loading={isLoading}
            icon={<Ionicons name="send" size={20} color="#fff" />}
            iconPosition="right"
          />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-500">Vous vous souvenez ? </Text>
            <TouchableOpacity onPress={onBack}>
              <Text className="text-primary-600 font-semibold">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

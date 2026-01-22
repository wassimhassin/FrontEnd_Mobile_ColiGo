import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui';

interface HomeScreenProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  userRole,
  onLogout,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-500 text-sm">Bonjour,</Text>
            <Text className="text-xl font-bold text-gray-800">{userName}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="bg-primary-100 px-3 py-1 rounded-full mr-3">
              <Text className="text-primary-600 font-medium text-sm capitalize">
                {userRole}
              </Text>
            </View>
            <View className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center">
              <Ionicons name="person" size={20} color="#6b7280" />
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
          Bienvenue sur ColiGo !
        </Text>
        
        <Text className="text-gray-500 text-center mb-8">
          Votre compte a été créé avec succès.{'\n'}
          Cette page sera complétée prochainement.
        </Text>

        <View className="w-full">
          <Button
            title="Se déconnecter"
            onPress={onLogout}
            variant="outline"
            icon={<Ionicons name="log-out-outline" size={20} color="#2563eb" />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

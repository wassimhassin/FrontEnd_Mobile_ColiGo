import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Button } from '../../components/ui';

const { height } = Dimensions.get('window');

interface TermsScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

const CheckBox = ({
  checked,
  onPress,
  label,
}: {
  checked: boolean;
  onPress: () => void;
  label: string;
}) => {
  const scale = useSharedValue(1);

  const handlePress = () => {
    scale.value = withSpring(0.9, {}, () => {
      scale.value = withSpring(1);
    });
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(checked ? 1 : 0, { duration: 200 }),
    transform: [{ scale: withSpring(checked ? 1 : 0.5) }],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-start py-3"
      activeOpacity={0.7}
    >
      <Animated.View
        style={animatedStyle}
        className={`
          w-6 h-6 rounded-lg border-2 items-center justify-center mr-3 mt-0.5
          ${checked ? 'bg-primary-600 border-primary-600' : 'border-gray-300 bg-white'}
        `}
      >
        <Animated.View style={checkAnimatedStyle}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </Animated.View>
      </Animated.View>
      <Text className="flex-1 text-gray-700 text-base leading-6">{label}</Text>
    </TouchableOpacity>
  );
};

const TERMS_CONTENT = `
Bienvenue sur ColiGo !

En utilisant notre plateforme, vous acceptez les conditions suivantes :

1. OBJET DU SERVICE
ColiGo est une plateforme de mise en relation entre clients souhaitant envoyer des colis et transporteurs effectuant des voyages internationaux.

2. INSCRIPTION ET VÉRIFICATION
• Tous les utilisateurs doivent fournir des informations exactes
• Une vérification d'identité (KYC) est obligatoire
• Les documents requis : passeport ou carte d'identité valide

3. RESPONSABILITÉS DES TRANSPORTEURS
• Déclarer les voyages avec précision
• Respecter les délais de livraison annoncés
• Prendre soin des colis transportés
• Accepter ou refuser les réservations sous 24h

4. RESPONSABILITÉS DES CLIENTS
• Décrire précisément le contenu des colis
• Respecter les restrictions de transport
• Effectuer le paiement dans les délais

5. PAIEMENT ET COMMISSION
• Les paiements sont sécurisés via notre plateforme
• Une commission est prélevée sur chaque transaction
• Le transporteur reçoit son paiement après confirmation de livraison

6. ARTICLES INTERDITS
• Substances illégales
• Armes et munitions
• Produits dangereux
• Articles contrefaits

7. PROTECTION DES DONNÉES
Vos données personnelles sont protégées conformément au RGPD.

8. LITIGES
En cas de litige, notre équipe de médiation intervient pour trouver une solution équitable.
`;

export const TermsScreen: React.FC<TermsScreenProps> = ({
  onAccept,
  onDecline,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const progressAnim = useSharedValue(0);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      setHasScrolledToEnd(true);
    }

    const progress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    progressAnim.value = Math.min(1, Math.max(0, progress));
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  const canAccept = acceptedTerms && acceptedPrivacy;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center mb-2">
          <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
            <Ionicons name="document-text" size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Conditions d'utilisation
            </Text>
            <Text className="text-gray-500 text-sm">
              Veuillez lire attentivement
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
          <Animated.View
            style={progressStyle}
            className="h-full bg-primary-500 rounded-full"
          />
        </View>
      </View>

      {/* Terms Content */}
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          <Text className="text-gray-700 leading-7 text-base">
            {TERMS_CONTENT}
          </Text>
        </View>

        {/* Scroll Indicator */}
        {!hasScrolledToEnd && (
          <View className="items-center pb-4">
            <View className="bg-gray-100 rounded-full px-4 py-2 flex-row items-center">
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">
                Défiler pour continuer
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Section */}
      <View className="px-6 pb-6 pt-4 border-t border-gray-100">
        <View className="mb-4">
          <CheckBox
            checked={acceptedTerms}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            label="J'accepte les conditions générales d'utilisation"
          />
          <CheckBox
            checked={acceptedPrivacy}
            onPress={() => setAcceptedPrivacy(!acceptedPrivacy)}
            label="J'accepte la politique de confidentialité et le traitement de mes données"
          />
        </View>

        <View className="flex-row space-x-3">
          <View className="flex-1 mr-2">
            <Button
              title="Refuser"
              onPress={onDecline}
              variant="outline"
            />
          </View>
          <View className="flex-1 ml-2">
            <Button
              title="Accepter"
              onPress={onAccept}
              disabled={!canAccept}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

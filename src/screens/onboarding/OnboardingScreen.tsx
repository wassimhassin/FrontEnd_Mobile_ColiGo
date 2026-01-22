import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
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
  Extrapolation,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import { ONBOARDING_SLIDES } from '../../constants';
import { Button } from '../../components/ui';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const SlideIcon = ({ name, color }: { name: string; color: string }) => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    package: 'cube-outline',
    shield: 'shield-checkmark-outline',
    wallet: 'wallet-outline',
    tracking: 'location-outline',
  };

  return (
    <View
      style={{ backgroundColor: `${color}15` }}
      className="w-32 h-32 rounded-full items-center justify-center"
    >
      <Ionicons name={icons[name]} size={64} color={color} />
    </View>
  );
};

const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: typeof ONBOARDING_SLIDES[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );
    
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  return (
    <View style={{ width }} className="items-center justify-center px-8">
      <Animated.View style={animatedStyle} className="items-center">
        <SlideIcon name={item.image} color={item.color} />
        
        <Text className="text-3xl font-bold text-gray-800 text-center mt-10 mb-4">
          {item.title}
        </Text>
        
        <Text className="text-gray-500 text-center text-lg leading-7 px-4">
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
};

const Pagination = ({
  scrollX,
  length,
}: {
  scrollX: Animated.SharedValue<number>;
  length: number;
}) => {
  return (
    <View className="flex-row items-center justify-center">
      {Array.from({ length }).map((_, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 32, 8],
            Extrapolation.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP
          );

          return {
            width: dotWidth,
            opacity,
          };
        });

        return (
          <Animated.View
            key={index}
            style={animatedStyle}
            className="h-2 bg-primary-600 rounded-full mx-1"
          />
        );
      })}
    </View>
  );
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const index = Math.round(event.contentOffset.x / width);
      runOnJS(setCurrentIndex)(index);
    },
  });

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Skip Button */}
      <View className="absolute top-16 right-6 z-10">
        <TouchableOpacity onPress={handleSkip}>
          <Text className="text-gray-400 font-medium text-base">Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <View className="flex-1 justify-center">
        <Animated.FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={({ item, index }) => (
            <Slide item={item} index={index} scrollX={scrollX} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces={false}
        />
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-8">
        <Pagination scrollX={scrollX} length={ONBOARDING_SLIDES.length} />
        
        <View className="mt-8">
          <Button
            title={isLastSlide ? 'Commencer' : 'Suivant'}
            onPress={handleNext}
            icon={
              <Ionicons
                name={isLastSlide ? 'checkmark' : 'arrow-forward'}
                size={20}
                color="#fff"
              />
            }
            iconPosition="right"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Logo } from '../../components/ui';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 });

    // Auto navigate after animation
    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(onFinish)();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <StatusBar style="dark" />
      <Animated.View style={animatedStyle}>
        <Logo size="lg" animated />
      </Animated.View>
    </View>
  );
};

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  animated = true,
  showText = true,
}) => {
  const scale = useSharedValue(animated ? 0 : 1);
  const rotate = useSharedValue(animated ? -180 : 0);
  const textOpacity = useSharedValue(animated ? 0 : 1);
  const textTranslateY = useSharedValue(animated ? 20 : 0);

  const sizeConfig = {
    sm: { icon: 32, container: 48, text: 'text-xl' },
    md: { icon: 48, container: 72, text: 'text-3xl' },
    lg: { icon: 64, container: 96, text: 'text-4xl' },
  };

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      rotate.value = withSpring(0, { damping: 12, stiffness: 100 });
      textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
      textTranslateY.value = withDelay(300, withSpring(0, { damping: 12 }));
    }
  }, [animated]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const config = sizeConfig[size];

  return (
    <View className="items-center">
      <Animated.View
        style={[
          iconAnimatedStyle,
          {
            width: config.container,
            height: config.container,
          },
        ]}
        className="bg-primary-600 rounded-2xl items-center justify-center shadow-lg"
      >
        <Ionicons name="cube" size={config.icon} color="#fff" />
      </Animated.View>
      
      {showText && (
        <Animated.View style={textAnimatedStyle} className="mt-3">
          <Text className={`${config.text} font-bold text-gray-800`}>
            Coli<Text className="text-primary-600">Go</Text>
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

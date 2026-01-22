import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    const borderColor = error
      ? '#ef4444'
      : interpolateColor(focusAnim.value, [0, 1], ['#e5e7eb', '#3b82f6']);
    return { borderColor };
  });

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">{label}</Text>
      )}
      
      <Animated.View
        style={animatedBorderStyle}
        className={`
          flex-row items-center
          bg-gray-50 rounded-xl border-2
          ${error ? 'border-red-500' : ''}
        `}
      >
        {leftIcon && (
          <View className="pl-4">
            <Ionicons
              name={leftIcon}
              size={20}
              color={isFocused ? '#3b82f6' : '#9ca3af'}
            />
          </View>
        )}
        
        <TextInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !showPassword}
          className={`
            flex-1 py-3.5 px-4
            text-gray-800 text-base
            ${leftIcon ? 'pl-3' : ''}
            ${rightIcon || isPassword ? 'pr-3' : ''}
          `}
          placeholderTextColor="#9ca3af"
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="pr-4"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="pr-4"
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Ionicons name="alert-circle" size={14} color="#ef4444" />
          <Text className="text-red-500 text-xs ml-1">{error}</Text>
        </View>
      )}
      
      {hint && !error && (
        <Text className="text-gray-400 text-xs mt-1.5">{hint}</Text>
      )}
    </View>
  );
};

import React from 'react';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable } from 'react-native';

function Heart() {
  const scale = useSharedValue(1);
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Pressable
      onPress={() => {
        scale.value = withTiming(scale.value + 0.5);
      }}>
      <Animated.View
        style={[{ width: 50, height: 50, backgroundColor: '#ffaaa8' }, styles]}
      />
    </Pressable>
  );
}

export function AnimatedReactions() {
  return (
    <CenterScreen>
      <Heart />
    </CenterScreen>
  );
}

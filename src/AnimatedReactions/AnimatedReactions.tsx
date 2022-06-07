import React from 'react';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable } from 'react-native';

function Heart() {
  return (
    <Pressable onPress={() => {}}>
      <Animated.View
        style={[{ width: 50, height: 50, backgroundColor: '#ffaaa8' }]}
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

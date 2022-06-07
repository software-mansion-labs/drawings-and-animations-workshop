import React, { useState } from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, { BounceIn, Keyframe, ZoomOut } from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const BetterBounce = new Keyframe({
  0: { transform: [{ scale: 1 }] },
  45: { transform: [{ scale: 2 }] },
  100: { transform: [{ scale: 1 }] },
});

function Heart() {
  const [selected, setSelected] = useState(false);

  return (
    <Pressable onPress={() => setSelected(!selected)}>
      <AnimatedIcon
        key={selected ? 1 : 0}
        name="favorite"
        size={50}
        color={selected ? '#ffaaa8' : '#aaa'}
        exiting={ZoomOut}
        entering={BounceIn}
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

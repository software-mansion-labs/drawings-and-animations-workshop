import React, { useState } from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  withSequence,
} from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Heart() {
  const [selected, setSelected] = useState(false);
  const scale = useSharedValue(1);

  useAnimatedReaction(
    () => selected,
    (isSelected) => {
      if (isSelected) {
        scale.value = withSequence(withTiming(1.5), withTiming(1));
      }
    }
  );

  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const props = useAnimatedProps(() => {
    return {
      color: withTiming(selected ? '#ffaaa8' : '#aaa'),
    };
  });

  return (
    <Pressable onPress={() => setSelected(!selected)}>
      <AnimatedIcon
        name="favorite"
        size={50}
        style={styles}
        animatedProps={props}
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

import React, { useEffect, useRef, useState } from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  BounceIn,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomOut,
} from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable } from 'react-native';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const VX_MAX = 35;
const VY_MAX = 80;

function randomSpeed() {
  return {
    vx: Math.random() * 2 * VX_MAX - VX_MAX,
    vy: Math.random() * VY_MAX,
    angular: Math.random() * Math.PI - Math.PI / 2,
  };
}

function FlyingHeart() {
  const time = useSharedValue(0);
  const { vx, vy, angular } = useRef(randomSpeed()).current;
  const duration = 30;
  const g = 15;

  const styles = useAnimatedStyle(() => {
    const t = time.value / 1000;
    const x = vx * t;
    const y = vy * t + (-g * t * t) / 2;
    const angle = angular * t;
    return {
      transform: [
        { translateX: x },
        { translateY: -y },
        { rotateZ: `${angle}rad` },
      ],
    };
  });
  useEffect(() => {
    time.value = withTiming(duration * 1000, {
      duration: (duration * 1000) / 10,
      easing: Easing.linear,
    });
  }, []);
  return (
    <AnimatedIcon
      name="favorite"
      size={50}
      color={'#ffaaa8'}
      style={[{ position: 'absolute' }, styles]}
    />
  );
}

function ExplodingHearts({ count = 20 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        return <FlyingHeart key={index} />;
      })}
    </>
  );
}

function Heart() {
  const [selected, setSelected] = useState(false);

  return (
    <>
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
      {selected && <ExplodingHearts />}
    </>
  );
}

export function AnimatedReactions() {
  return (
    <CenterScreen>
      <Heart />
    </CenterScreen>
  );
}

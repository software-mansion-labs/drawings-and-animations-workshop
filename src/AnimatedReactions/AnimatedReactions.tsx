import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const VX_MAX = 35;
const VY_MAX = 80;

function randomSpeed() {
  return {
    vx: Math.random() * 2 * VX_MAX - VX_MAX,
    vy: Math.random() * VY_MAX,
    angular: Math.random() * Math.PI,
  };
}

function FlyingHeart({ color = '#900' }) {
  const time = useSharedValue(0);
  const { vx, vy, angular } = useRef(randomSpeed()).current;
  const g = 15;
  const duration = 30;
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
    time.value = withTiming(duration * 1000, { duration: duration * 100 });
  }, []);
  return (
    <AnimatedIcon
      name="favorite"
      size={50}
      color={color}
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
  const [faved, setFaved] = useState(false);
  const color = faved ? '#900' : '#aaa';
  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(setFaved)(!faved);
  });
  const scale = useSharedValue(1);
  const longPress = Gesture.LongPress()
    .onStart(() => {
      scale.value = withTiming(2, { duration: 2000 });
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      runOnJS(setFaved)(!faved);
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      color: withTiming(color),
    };
  });
  return (
    <>
      <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
        <AnimatedIcon name="favorite" size={50} style={styles} />
      </GestureDetector>
      {faved && <ExplodingHearts />}
    </>
  );
}

function CenterScreen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
      {children}
    </SafeAreaView>
  );
}

export function AnimatedReactions() {
  return (
    <CenterScreen>
      <Heart />
    </CenterScreen>
  );
}

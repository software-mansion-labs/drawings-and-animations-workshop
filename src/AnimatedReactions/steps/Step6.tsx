import React, { useEffect, useRef, useState } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CenterScreen } from "../components/CenterScreen";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function FlyingHeart() {
  const time = useSharedValue(0);
  const vx = 30;
  const vy = 50;
  const g = 15;
  const duration = 30;
  const styles = useAnimatedStyle(() => {
    const t = time.value / 1000;
    const x = vx * t;
    const y = vy * t + (-g * t * t) / 2;
    return {
      transform: [{ translateX: x }, { translateY: -y }],
    };
  });
  useEffect(() => {
    time.value = withTiming(duration * 1000, {
      duration: (duration * 1000) / 5,
      easing: Easing.linear,
    });
  }, []);
  return (
    <AnimatedIcon name="favorite" size={50} color={"#ffaaa8"} style={styles} />
  );
}

export function AnimatedReactions() {
  return (
    <CenterScreen>
      <FlyingHeart />
    </CenterScreen>
  );
}

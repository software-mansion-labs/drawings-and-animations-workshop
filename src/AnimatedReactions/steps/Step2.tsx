import React from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  withTiming,
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";
import { Pressable } from "react-native";

import { CenterScreen } from "../components/CenterScreen";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Heart() {
  const scale = useSharedValue(1);
  const color = useSharedValue("#aaa");
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const props = useAnimatedProps(() => {
    return {
      color: color.value,
    };
  });

  return (
    <Pressable
      onPress={() => {
        scale.value = withTiming(1.5);
        color.value = withTiming("#ffaaa8");
      }}
    >
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

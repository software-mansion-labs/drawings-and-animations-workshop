import React, { useEffect, useRef, useState } from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { ColorValue } from "react-native";
import { View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CenterScreen } from "../components/CenterScreen";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const WIDTH = 50;

function Sticker({ iconName, color }: { iconName: string; color: ColorValue }) {
  const tap = Gesture.Tap().onEnd(() => {
    console.log("Do nothing yet");
  });
  const scale = useSharedValue(1);
  const longPress = Gesture.LongPress()
    .onStart(() => {
      scale.value = withTiming(3, { duration: 2000 });
    })
    .onEnd(() => {
      scale.value = withSpring(1);
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      zIndex: scale.value > 1 ? 100 : 1,
    };
  });
  return (
    <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
      <AnimatedIcon name={iconName} size={WIDTH} color={color} style={styles} />
    </GestureDetector>
  );
}

const STICKERS_COUNT = 4;

function snapPoint(x: number, vx: number) {
  "worklet";
  const tossX = x + vx * 0.1; // simulate movement for 0.1 second
  const position = Math.max(
    -STICKERS_COUNT + 1,
    Math.min(0, Math.round(tossX / WIDTH))
  );
  return position * WIDTH;
}

function Toolbar() {
  const offsetY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onChange((e) => {
      offsetY.value += e.changeX;
    })
    .onEnd((e) => {
      offsetY.value = withSpring(snapPoint(offsetY.value, e.velocityX), {
        velocity: e.velocityX,
      });
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetY.value }],
    };
  });
  return (
    <View
      style={{
        overflow: "visible",
        width: 0,
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            { flexDirection: "row", width: WIDTH * 4, marginLeft: -WIDTH / 2 },
            styles,
          ]}
        >
          <Sticker iconName="favorite" color="#ffaaa8" />
          <Sticker iconName="grade" color="#001a72" />
          <Sticker iconName="thumb-up" color="#ffee86" />
          <Sticker iconName="emoji-events" color="#8ed3ef" />
        </Animated.View>
      </GestureDetector>
      <Icon
        style={{ position: "absolute", bottom: -30, left: -15 }}
        name="expand-less"
        size={30}
      />
    </View>
  );
}

export function GestureBasedPicker() {
  return (
    <CenterScreen>
      <Toolbar />
    </CenterScreen>
  );
}

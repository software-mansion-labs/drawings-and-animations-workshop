import React from "react";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ColorValue, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { CenterScreen } from "../components/CenterScreen";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const WIDTH = 50;

function Toolbar() {
  return (
    <View
      style={{
        overflow: "visible",
        width: 0,
      }}
    >
      <GestureDetector>
        <Animated.View
          style={[
            { flexDirection: "row", width: WIDTH * 4, marginLeft: -WIDTH / 2 },
          ]}
        >
          {/* <Sticker iconName="favorite" color="#ffaaa8" />
          <Sticker iconName="grade" color="#001a72" />
          <Sticker iconName="thumb-up" color="#ffee86" />
          <Sticker iconName="emoji-events" color="#8ed3ef" /> */}
        </Animated.View>
      </GestureDetector>
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

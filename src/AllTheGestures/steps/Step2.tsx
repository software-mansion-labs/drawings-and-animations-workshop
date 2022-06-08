import type { ReactNode } from "react";
import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { createIdentityMatrix, translate3d } from "../components/matrixMath";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Movable({ children }: { children: ReactNode }) {
  const matrix = useSharedValue(createIdentityMatrix());
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ matrix: matrix.value }],
    };
  });

  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = translate3d(matrix.value, e.changeX, e.changeY, 0);
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ position: "absolute" }, styles]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

export function AllTheGestures() {
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <Movable>
        <AnimatedIcon name="favorite" color="#ffaaa8" size={150} />
      </Movable>
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Movable({ children }: { children: ReactNode }) {
  const position = useSharedValue({ x: 0, y: 0 });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
      ],
    };
  });

  const pan = Gesture.Pan().onChange((e) => {
    const { x, y } = position.value;
    position.value = { x: x + e.changeX, y: y + e.changeY };
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

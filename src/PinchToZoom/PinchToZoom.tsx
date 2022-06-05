/* eslint-disable @typescript-eslint/no-var-requires */
import type { Transforms2d } from "@shopify/react-native-skia";
import {
  Canvas,
  useImage,
  Image,
  useSharedValueEffect,
  useValue,
  Group,
} from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue, withTiming } from "react-native-reanimated";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");
//const center = vec(width / 2, height / 2);

export const PinchToZoom = () => {
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);

  const transform = useValue<Transforms2d>([]);

  const pinch = Gesture.Pinch()
    .onStart((event) => {
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onChange((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withTiming(1);
      focalX.value = withTiming(0);
      focalY.value = withTiming(0);
    });
  const gesture = pinch;
  const image = useImage(zurich);
  useSharedValueEffect(
    () => {
      transform.current = [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
        { translateX: -focalX.value },
        { translateY: -focalY.value },
      ];
    },
    scale,
    focalX,
    focalY
  );
  if (!image) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1 }}>
          <Group transform={transform}>
            <Image
              x={0}
              y={0}
              width={width}
              height={height}
              image={image}
              fit="cover"
            />
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

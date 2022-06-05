/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Canvas,
  Fill,
  useImage,
  Image,
  useSharedValueEffect,
  Skia,
  useValue,
  Group,
} from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";

const zurich = require("./assets/zurich.jpg");
const { width, height } = Dimensions.get("window");
export const assets = [zurich];

export const PinchToZoom = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const transform = useValue([
    { translateX: 0 },
    { translateY: 0 },
    { scale: 1 },
  ]);
  const pan = Gesture.Pan().onChange(({ translationX, translationY }) => {
    translateX.value = translationX;
    translateY.value = translationY;
  });
  const pinch = Gesture.Pinch().onChange((event) => {
    scale.value = event.scale;
  });
  const gesture = Gesture.Race(pan, pinch);
  const image = useImage(zurich);
  useSharedValueEffect(
    () => {
      transform.current = [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ];
    },
    translateX,
    translateY,
    scale
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

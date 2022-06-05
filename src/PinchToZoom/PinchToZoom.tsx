/* eslint-disable @typescript-eslint/no-var-requires */
import type { Transforms2d } from "@shopify/react-native-skia";
import {
  vec,
  useCanvas,
  useDerivedValue,
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
const center = vec(width / 2, height / 2);
export const assets = [zurich];

export const PinchToZoom = () => {
  // const pan = Gesture.Pan()
  //   .onStart(() => {})
  //   .onChange(({ translationX, translationY }) => {

  //   });
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);
  const offsetScale = useSharedValue(1);

  const transform = useValue<Transforms2d>([]);

  const pinch = Gesture.Pinch()
    .onStart(() => {
      offsetScale.value = scale.value;
    })
    .onChange((event) => {
      scale.value = event.scale;
    });
  const gesture = pinch; //Gesture.Race(pan, pinch);
  const image = useImage(zurich);
  useSharedValueEffect(() => {
    transform.current = [
      { translateX: center.x },
      { translateY: center.y },
      { scale: offsetScale.value * scale.value },
      { translateX: -center.x },
      { translateY: -center.y },
    ];
  }, scale);
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

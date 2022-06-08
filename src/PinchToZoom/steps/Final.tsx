/* eslint-disable @typescript-eslint/no-var-requires */
import type { SkMatrix } from "@shopify/react-native-skia";
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
import { useSharedValue } from "react-native-reanimated";

import { createIdentityMatrix, scale3d, toSkMatrix } from "./matrixMath";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");

export const PinchToZoom = () => {
  const matrix = useSharedValue(createIdentityMatrix());

  const skMatrix = useValue<SkMatrix>(toSkMatrix(createIdentityMatrix()));

  const scale = Gesture.Pinch().onChange((e) => {
    matrix.value = scale3d(
      matrix.value,
      e.scaleChange,
      e.scaleChange,
      1,
      e.focalX,
      e.focalY,
      0
    );
  });

  const image = useImage(zurich);
  useSharedValueEffect(() => {
    skMatrix.current = toSkMatrix(matrix.value);
  }, matrix);
  if (!image) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={scale}>
        <Canvas style={{ flex: 1 }}>
          <Group matrix={skMatrix} transform={[]}>
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

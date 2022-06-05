/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Canvas,
  ColorMatrix,
  Group,
  Image,
  useImage,
  useTouchHandler,
  useValue,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { contains, Filters, rects } from "./Filters";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");
//const center = vec(width / 2, height / 2);

const noFilter = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
const blackAndWhite = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
];
const milk = [0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0.6, 1, 0, 0, 0, 0, 0, 1, 0];
const coldLife = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, -0.2, 0.2, 0.1, 0.4, 0, 0, 0, 0, 1, 0,
];
const filters = [noFilter, blackAndWhite, milk, coldLife] as const;

export const PhotoEditor = () => {
  const onTouch = useTouchHandler({
    onEnd: (pt) => {
      if (contains(pt, rects[0])) {
        matrix.current = filters[0];
      } else if (contains(pt, rects[1])) {
        matrix.current = filters[1];
      } else if (contains(pt, rects[2])) {
        matrix.current = filters[2];
      } else if (contains(pt, rects[3])) {
        matrix.current = filters[3];
      }
    },
  });
  const matrix = useValue<number[]>(noFilter);
  const image = useImage(zurich);
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Group>
        <ColorMatrix matrix={matrix} />
        <Image
          x={0}
          y={0}
          width={width}
          height={height}
          image={image}
          fit="cover"
        />
      </Group>
      <Filters image={image} filters={filters} />
    </Canvas>
  );
};

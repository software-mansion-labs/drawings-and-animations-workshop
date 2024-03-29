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

import { Filters, f1, selectFilter } from "./Filters";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");
//const center = vec(width / 2, height / 2);

export const PhotoEditor = () => {
  const image = useImage(zurich);
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }}>
      <Group>
        <Image
          x={0}
          y={0}
          width={width}
          height={height}
          image={image}
          fit="cover"
        />
      </Group>
      <Filters image={image} />
    </Canvas>
  );
};

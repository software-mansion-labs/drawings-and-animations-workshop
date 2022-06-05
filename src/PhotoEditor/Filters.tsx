import type { SkImage, Vector, SkRect } from "@shopify/react-native-skia";
import {
  ImageShader,
  RoundedRect,
  Shadow,
  rect,
  rrect,
  ColorMatrix,
  Group,
  Image,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const size = width / 4;

export const contains = (pt: Vector, rct: SkRect) =>
  pt.x >= rct.x &&
  pt.x <= rct.x + rct.width &&
  pt.y >= rct.y &&
  pt.y <= rct.y + rct.height;
export const rects = new Array(4)
  .fill(0)
  .map((_, i) => rect(size * i, height - size - 125, size, size));

interface FiltersProps {
  image: SkImage;
  filters: readonly [number[], number[], number[], number[]];
}

export const Filters = ({ image, filters }: FiltersProps) => {
  return (
    <>
      {filters.map((filter, i) => {
        return (
          <Group
            key={i}
            transform={[
              { translateX: size * i },
              { translateY: height - size - 125 },
            ]}
          >
            <ColorMatrix matrix={filter} />
            <Shadow dx={1} dy={1} blur={4} color="black" />
            <ImageShader
              image={image}
              x={0}
              y={0}
              width={size}
              height={size}
              fit="cover"
            />
            <RoundedRect rect={rrect(rect(4, 4, size - 8, size - 8), 8, 8)} />
          </Group>
        );
      })}
    </>
  );
};

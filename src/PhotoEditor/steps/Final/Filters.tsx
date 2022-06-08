/* eslint-disable prefer-destructuring */
import type {
  SkImage,
  Vector,
  SkRect,
  SkiaMutableValue,
} from "@shopify/react-native-skia";
import {
  ImageShader,
  RoundedRect,
  Shadow,
  rect,
  rrect,
  ColorMatrix,
  Group,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";

import { contains } from "../../Helpers";

const { width, height } = Dimensions.get("window");
const size = width / 4;

const rects = new Array(4)
  .fill(0)
  .map((_, i) => rect(size * i, height - size - 125, size, size));
export const noFilter = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
];
const blackAndWhite = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
];
const milk = [0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 0.6, 1, 0, 0, 0, 0, 0, 1, 0];
const coldLife = [
  1, 0, 0, 0, 0, 0, 1, 0, 0, 0, -0.2, 0.2, 0.1, 0.4, 0, 0, 0, 0, 1, 0,
];
export const filters = [noFilter, blackAndWhite, milk, coldLife] as const;

export const selectFilter = (
  matrix: SkiaMutableValue<number[]>,
  pt: Vector
) => {
  if (contains(pt, rects[0])) {
    matrix.current = filters[0];
  } else if (contains(pt, rects[1])) {
    matrix.current = filters[1];
  } else if (contains(pt, rects[2])) {
    matrix.current = filters[2];
  } else if (contains(pt, rects[3])) {
    matrix.current = filters[3];
  }
};

interface FiltersProps {
  image: SkImage;
}

export const Filters = ({ image }: FiltersProps) => {
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

import { Dimensions } from "react-native";
import type { SkiaReadonlyValue } from "@shopify/react-native-skia";
import {
  rrect,
  rect,
  RoundedRect,
  Group,
  vec,
  Line,
  Circle,
  useDerivedValue,
} from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");
export const CURSOR_SIZE = 40;
export const PADDING = 32;
export const SLIDER_WIDTH = width - 2 * PADDING;

interface SliderProps {
  x: SkiaReadonlyValue<number>;
}

export const Slider = ({ x }: SliderProps) => {
  const transform = useDerivedValue(() => [{ translateX: x.current }], [x]);
  return (
    <Group>
      <Line
        p1={vec(PADDING + CURSOR_SIZE / 2, CURSOR_SIZE / 2)}
        p2={vec(PADDING + SLIDER_WIDTH - CURSOR_SIZE / 2, CURSOR_SIZE / 2)}
        style="stroke"
        strokeWidth={1}
        color="rgba(50, 50, 50, 0.5)"
      />
      <Group transform={transform}>
        <Circle c={vec(CURSOR_SIZE / 2, CURSOR_SIZE / 2)} r={5} color="black" />
        <RoundedRect
          rect={rrect(
            rect(0, 0, CURSOR_SIZE, CURSOR_SIZE),
            CURSOR_SIZE * 0.3,
            CURSOR_SIZE * 0.3
          )}
          color="white"
          strokeWidth={3}
          style="stroke"
        />
      </Group>
    </Group>
  );
};

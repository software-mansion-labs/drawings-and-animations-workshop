import type { SkPath } from "@shopify/react-native-skia";
import { vec } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const inputRange = [0, 0.5, 1];

export const center = vec(width / 2, height / 2);

export const interpolatePaths = (
  value: number,
  input: number[],
  outputRange: SkPath[]
) => {
  let i = 0;
  for (; i <= input.length - 1; i++) {
    if (value >= input[i] && value <= input[i + 1]) {
      break;
    }
    if (i === input.length - 1) {
      return outputRange[i];
    }
  }
  const t = (value - input[i]) / (input[i + 1] - input[i]);
  return outputRange[i + 1].interpolate(outputRange[i], t);
};

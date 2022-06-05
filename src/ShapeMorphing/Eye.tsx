import type { SkiaValue } from "@shopify/react-native-skia";
import {
  interpolateVector,
  translate,
  useDerivedValue,
  Path,
  Skia,
  Group,
  Circle,
  center as getCenter,
} from "@shopify/react-native-skia";

import { center, interpolatePaths, inputRange } from "./Helpers";

interface EyeProps {
  flip?: boolean;
  progress: SkiaValue<number>;
}

const angryPath = Skia.Path.Make();
angryPath.moveTo(16, 25);
angryPath.cubicTo(32.2, 27.09, 43.04, 28.2, 48.51, 28.34);
angryPath.cubicTo(53.99, 28.48, 62.15, 27.78, 73, 26.25);
angryPath.cubicTo(66.28, 53.93, 60.19, 69.81, 54.74, 73.88);
angryPath.cubicTo(50.63, 76.96, 40.4, 74.65, 27.48, 54.51);
angryPath.cubicTo(24.68, 50.15, 20.85, 40.32, 27.48, 54.51);
angryPath.close();

const normalPath = Skia.Path.Make();
normalPath.moveTo(20.9, 30.94);
normalPath.cubicTo(31.26, 31.66, 38.61, 32.2, 42.96, 32.56);
normalPath.cubicTo(66.94, 34.53, 79.65, 36.45, 81.11, 38.32);
normalPath.cubicTo(83.9, 41.9, 73.77, 56.6, 65.83, 59.52);
normalPath.cubicTo(61.95, 60.95, 45.72, 58.91, 32.42, 49.7);
normalPath.cubicTo(23.56, 43.56, 19.71, 37.3, 20.9, 30.94);
normalPath.close();

const goodPath = Skia.Path.Make();
goodPath.moveTo(21, 45);
goodPath.cubicTo(21, 36.78, 24.26, 29.42, 29.41, 24.47);
goodPath.cubicTo(33.61, 20.43, 38.05, 18, 45, 18);
goodPath.cubicTo(58.25, 18, 69, 30.09, 69, 45);
goodPath.cubicTo(69, 59.91, 58.25, 72, 45, 72);
goodPath.cubicTo(31.75, 72, 21, 59.91, 21, 45);
goodPath.close();

const c1 = getCenter(angryPath.computeTightBounds());
const c2 = getCenter(normalPath.computeTightBounds());
const c3 = getCenter(angryPath.computeTightBounds());

export const Eye = ({ flip, progress }: EyeProps) => {
  const path = useDerivedValue(
    () =>
      interpolatePaths(progress.current, inputRange, [
        angryPath,
        normalPath,
        goodPath,
      ]),
    [progress]
  );
  const c = useDerivedValue(
    () => interpolateVector(progress.current, inputRange, [c1, c2, c3]),
    [progress]
  );
  return (
    <Group
      transform={[
        ...translate(center),
        { translateY: -125 },
        { scaleX: flip ? -1 : 1 },
      ]}
    >
      <Path path={path} color="black" style="stroke" strokeWidth={4} />
      <Circle c={c} r={5} color="black" />
    </Group>
  );
};

import type { SkiaReadonlyValue } from "@shopify/react-native-skia";
import { Path, Skia, useDerivedValue } from "@shopify/react-native-skia";

import { inputRange, interpolatePaths } from "./Helpers";

const angryPath = Skia.Path.Make();
angryPath.moveTo(13, 36);
angryPath.cubicTo(24.69, 16.57, 36.13, 10.09, 47.31, 16.57);
angryPath.cubicTo(63.87, 6.88, 72.99, -10.46, 106, 24.58);

const normalPath = Skia.Path.Make();
normalPath.moveTo(1, 5);
normalPath.cubicTo(
  21.3645524,
  8.8631006,
  36.1003168,
  11.50936377,
  45.2072933,
  12.93878949
);
normalPath.cubicTo(
  74.3732915,
  17.51666758,
  98.6375271,
  19.805606623,
  118,
  19.805606623
);

const goodPath = Skia.Path.Make();
goodPath.moveTo(1, 2);
goodPath.cubicTo(
  17.8783339,
  14.0562303,
  30.157132,
  21.942809699999998,
  37.8363943,
  25.6597381
);
goodPath.cubicTo(
  70.7689993,
  41.59982822,
  97.4902012,
  38.64845107,
  118.0,
  16.8056066
);

interface MouthProps {
  progress: SkiaReadonlyValue<number>;
}

export const Mouth = ({ progress }: MouthProps) => {
  const path = useDerivedValue(
    () =>
      interpolatePaths(progress.current, inputRange, [
        angryPath,
        normalPath,
        goodPath,
      ]),
    [progress]
  );
  return (
    <Path
      path={path}
      color="white"
      style="stroke"
      strokeJoin="round"
      strokeCap="round"
      strokeWidth={3}
    />
  );
};

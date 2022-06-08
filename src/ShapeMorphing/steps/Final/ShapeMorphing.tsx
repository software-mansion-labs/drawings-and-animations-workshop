import {
  Canvas,
  Fill,
  useValue,
  interpolateColors,
  useDerivedValue,
  Skia,
  clamp,
  useTouchHandler,
} from "@shopify/react-native-skia";

import { Eye } from "./Eye";
import { inputRange } from "./Helpers";
import { Mouth } from "./Mouth";
import { PADDING, Slider, CURSOR_SIZE, SLIDER_WIDTH } from "./Slider";
import { Title } from "./Title";

const outputRange = ["#FDBEEB", "#FDEEBE", "#BEFDE5"].map((c) => Skia.Color(c));
const start = PADDING;
const end = PADDING + SLIDER_WIDTH - CURSOR_SIZE;

export const ShapeMorphing = () => {
  const offset = useValue(0);
  const x = useValue(PADDING);
  const onTouch = useTouchHandler({
    onStart: (pt) => {
      offset.current = x.current - pt.x;
    },
    onActive: (pt) => {
      x.current = clamp(offset.current + pt.x, start, end);
    },
  });
  const progress = useDerivedValue(
    () => (x.current - start) / (end - start),
    [x]
  );
  const color = useDerivedValue(
    () => interpolateColors(progress.current, inputRange, outputRange),
    [progress]
  );
  return (
    <Canvas onTouch={onTouch} style={{ flex: 1 }}>
      <Fill color={color} />
      <Title progress={progress} />
      <Slider x={x} />
      <Eye progress={progress} />
      <Eye progress={progress} flip />
      <Mouth progress={progress} />
    </Canvas>
  );
};

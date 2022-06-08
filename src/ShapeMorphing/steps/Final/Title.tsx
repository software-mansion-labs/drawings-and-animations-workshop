import type { SkiaValue } from "@shopify/react-native-skia";
import {
  runTiming,
  useValueEffect,
  Group,
  Text,
  useFont,
  useValue,
  interpolate,
  useDerivedValue,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const offset = 100;
const titleSize = 42;
const labelSize = 24;
const { width } = Dimensions.get("window");

enum State {
  BAD,
  OK,
  GOOD,
}

interface TitleProps {
  progress: SkiaValue<number>;
}

export const Title = ({ progress }: TitleProps) => {
  const x = useValue(-width / 2);
  const state = useDerivedValue(() => {
    if (progress.current <= 0.33) {
      return State.BAD;
    } else if (progress.current <= 0.66) {
      return State.OK;
    } else {
      return State.GOOD;
    }
  }, [progress]);
  const transform = useDerivedValue(() => [{ translateX: x.current }], [x]);
  const titleFont = useFont(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("./assets/SF-Pro-Display-Medium.otf"),
    titleSize
  );
  const labelFont = useFont(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("./assets/SF-Pro-Display-Regular.otf"),
    labelSize
  );
  const o1 = useDerivedValue(
    () =>
      interpolate(
        x.current,
        [width / 2 - 50, width / 2, width / 2 + 50],
        [0, 1, 0]
      ),
    [x]
  );
  const o2 = useDerivedValue(
    () => interpolate(x.current, [-50, 0, 50], [0, 1, 0]),
    [x]
  );
  const o3 = useDerivedValue(
    () =>
      interpolate(
        x.current,
        [-width / 2 - 50, -width / 2, -width / 2 + 50],
        [0, 1, 0]
      ),
    [x]
  );
  useValueEffect(state, (s) => {
    if (s === State.BAD) {
      runTiming(x, { from: x.current, to: width / 2 }, { duration: 250 });
    } else if (s === State.OK) {
      runTiming(x, { from: x.current, to: 0 }, { duration: 250 });
    } else {
      runTiming(x, { from: x.current, to: -width / 2 }, { duration: 250 });
    }
  });
  if (!titleFont || !labelFont) {
    return null;
  }
  const t1 = "How was";
  const t2 = "your ride?";
  const p1 = titleFont.measureText(t1);
  const p2 = titleFont.measureText(t2);
  const l1 = "Hideous";
  const l2 = "Ok";
  const l3 = "Good";
  const l1p = labelFont.measureText(l1);
  const l2p = labelFont.measureText(l2);
  const l3p = labelFont.measureText(l3);
  const y = offset + titleSize * 2 + labelSize;
  return (
    <>
      <Text x={(width - p1.width) / 2} y={offset} text={t1} font={titleFont} />
      <Text
        x={(width - p2.width) / 2}
        y={offset + titleSize}
        text={t2}
        font={titleFont}
      />
      <Group transform={transform}>
        <Text
          x={-l1p.width / 2}
          y={y}
          font={labelFont}
          text={l1}
          opacity={o1}
        />
        <Text
          x={(width - l2p.width) / 2}
          y={y}
          font={labelFont}
          text={l2}
          opacity={o2}
        />
        <Text
          x={width - l3p.width / 2}
          y={y}
          font={labelFont}
          text={l3}
          opacity={o3}
        />
      </Group>
    </>
  );
};

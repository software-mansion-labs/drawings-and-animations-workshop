/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Canvas,
  Image,
  Path,
  Skia,
  useImage,
  useTouchHandler,
  useValue,
} from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");
export const Drawings = () => {
  // viewBox="0 0 544 450"
  const closed = useValue(true);
  const path = useValue(Skia.Path.Make());
  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      closed.current = true;
      path.current.moveTo(x, y);
    },
    onActive: ({ x, y }) => {
      const lastPt = path.current.getLastPt();
      const xMid = (lastPt.x + x) / 2;
      const yMid = (lastPt.y + y) / 2;
      path.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
    },
    onEnd: () => {
      closed.current = false;
    },
  });

  const image = useImage(zurich);
  if (!image) {
    return null;
  }
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <Image
        x={0}
        y={0}
        width={width}
        height={height}
        image={image}
        fit="cover"
      />
      <Path
        path={path}
        style="stroke"
        strokeWidth={8}
        color="lightblue"
        strokeJoin="round"
        strokeCap="round"
      />
    </Canvas>
  );
};

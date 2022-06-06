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
  const closed = useValue(false);
  const path = useValue(Skia.Path.Make());
  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      closed.current = true;
      path.current.moveTo(x, y);
    },
    onActive: ({ x, y }) => {
      path.current.lineTo(x, y);
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

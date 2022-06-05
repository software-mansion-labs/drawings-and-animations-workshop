import {
  Canvas,
  Path,
  Skia,
  useTouchHandler,
  useValue,
} from "@shopify/react-native-skia";

export const Drawings = () => {
  const closed = useValue(true);
  const path = useValue(Skia.Path.Make());
  const onTouch = useTouchHandler({
    onActive: ({ x, y }) => {
      // Calculate and add a smooth curve to the current path
      if (closed.current) {
        path.current.moveTo(x, y);
        closed.current = false;
      } else {
        const lastPt = path.current.getLastPt();
        const xMid = (lastPt.x + x) / 2;
        const yMid = (lastPt.y + y) / 2;
        path.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
      }
    },
    onEnd: () => {
      closed.current = true;
    },
  });
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
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

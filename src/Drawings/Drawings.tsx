import {
  Canvas,
  Path,
  Skia,
  useTouchHandler,
  useValue,
} from "@shopify/react-native-skia";

const defaultPath = Skia.Path.MakeFromSVGString(
  // eslint-disable-next-line max-len
  "M280.219 93.29C292.844 74.13 302.614 56.724 314.817 41.235C367.77 -25.988 486.747 -4.79201 523.597 63.915H523.593C543.648 101.403 548.933 145.04 538.405 186.235C527.139 232.505 504.444 275.208 472.393 310.435C437.19 350.044 400.764 388.611 380.006 438.705C375.878 448.666 364.85 452.471 357.244 445.541C318.029 409.787 266.603 409.912 219.744 396.533C188.135 387.509 156.338 378.787 125.498 367.533C84.7954 352.81 49.2444 326.592 23.1584 292.056C4.78343 268.767 -3.03657 238.861 1.59243 209.56C4.76823 183.212 13.2524 157.787 26.5374 134.814C39.8224 111.841 57.6274 91.8019 78.8814 75.9119C102.639 57.7009 131.873 57.1309 159.799 54.0679H159.796C199.378 49.2476 239.175 61.1538 269.616 86.9119C272.979 89.3181 276.526 91.4549 280.229 93.2986L280.219 93.29Z"
)!;
const m = Skia.Matrix();
m.preTranslate(50, 50);
m.preScale(0.5, 0.5);
defaultPath.transform(m);

export const Drawings = () => {
  // viewBox="0 0 544 450"
  const closed = useValue(true);
  const path = useValue(defaultPath);
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

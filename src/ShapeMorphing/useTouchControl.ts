import type {
  ExtendedTouchInfo,
  SkiaReadonlyValue,
  SkPoint,
  SkRect,
  TouchHandlers,
  TouchInfo,
  Vector,
} from "@shopify/react-native-skia";
import {
  useValue,
  dist,
  isValue,
  useTouchHandler as useCanvasTouchHandler,
} from "@shopify/react-native-skia";

const inRect = ({ x, y }: Vector, rect: SkRect): boolean =>
  x >= rect.x &&
  x <= rect.x + rect.width &&
  y >= rect.y &&
  y <= rect.y + rect.height;

interface Circle {
  r: number;
  c: SkPoint;
}

const isCircle = (area: Circle | SkRect): area is Circle =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (area as any).r !== undefined && (area as any).c !== undefined;

type Region<T> = T | SkiaReadonlyValue<T>;

interface TouchConfig {
  area: Region<SkRect> | Region<Circle>;
  sticky?: boolean;
}

export const useTouchHandler = (
  handler: TouchHandlers,
  config: TouchConfig,
  deps?: Parameters<typeof useCanvasTouchHandler>[1]
) => {
  const { sticky = true, area } = config;
  const active = useValue(false);
  return useCanvasTouchHandler(
    {
      onStart: (pt: TouchInfo) => {
        const materialized = isValue(area) ? area.current : area;
        if (
          (isCircle(materialized) &&
            dist(pt, materialized.c) <= materialized.r) ||
          inRect(pt, materialized as SkRect)
        ) {
          active.current = true;
          handler.onStart?.(pt);
        }
      },
      onActive: (pt: ExtendedTouchInfo) => {
        const materialized = isValue(area) ? area.current : area;
        if (
          (sticky && active.current) ||
          (isCircle(materialized) &&
            dist(pt, materialized.c) <= materialized.r) ||
          inRect(pt, materialized as SkRect)
        ) {
          handler.onActive?.(pt);
        }
      },
      onEnd: (pt: ExtendedTouchInfo) => {
        if (active.current) {
          active.current = false;
          handler.onEnd?.(pt);
        }
      },
    },
    deps
  );
};

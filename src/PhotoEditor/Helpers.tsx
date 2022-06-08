import type { SkRect, Vector } from "@shopify/react-native-skia";

export const contains = (pt: Vector, rct: SkRect) =>
  pt.x >= rct.x &&
  pt.x <= rct.x + rct.width &&
  pt.y >= rct.y &&
  pt.y <= rct.y + rct.height;

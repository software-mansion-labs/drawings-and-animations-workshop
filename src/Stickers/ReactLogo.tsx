import {
  Canvas,
  Fill,
  Circle,
  Oval,
  rect,
  vec,
  Group,
  SweepGradient,
  RadialGradient,
  BlurMask,
} from '@shopify/react-native-skia';
import React from 'react';
import { Dimensions } from 'react-native';

export const ReactLogo = ({ width, height }) => {
  const ellipsisAspectRatio = 180 / 470;
  const rx = width / 2 - width * 0.05;
  const ry = rx * ellipsisAspectRatio;

  // Origin of the Logo
  const center = vec(width / 2, height / 2);
  // Radius of the middle circle
  const r = 0.08 * width;
  // Rectangle to draw the oval in
  const rct = rect(center.x - rx, center.y - ry, rx * 2, ry * 2);
  // Some colors
  const c1 = '#3884FF';
  const c2 = '#51D3ED';
  const strokeWidth = r;
  return (
    <Canvas style={{ width, height }}>
      <Group>
        <BlurMask blur={2} style="inner" />
        <Circle c={center} color="lightblue" r={r}>
          <RadialGradient
            c={vec(center.x + r / 2, center.y + r / 2)}
            colors={[c1, c2]}
            r={2 * r}
          />
        </Circle>
        <Group>
          <SweepGradient c={center} colors={[c1, c2, c1]} />
          <Group transform={[{ scaleX: -1 }]} origin={center}>
            <Oval rect={rct} style="stroke" strokeWidth={strokeWidth} />
          </Group>
          <Group transform={[{ rotate: Math.PI / 3 }]} origin={center}>
            <Oval rect={rct} style="stroke" strokeWidth={strokeWidth} />
          </Group>
          <Group transform={[{ rotate: -Math.PI / 3 }]} origin={center}>
            <Oval rect={rct} style="stroke" strokeWidth={strokeWidth} />
          </Group>
        </Group>
      </Group>
    </Canvas>
  );
};

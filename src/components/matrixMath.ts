import { SkMatrix } from "@shopify/react-native-skia";

export type Affine3DMatrix = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export function createIdentityMatrix(): Affine3DMatrix {
  'worklet';
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

export function multiplyInto(
  out: Affine3DMatrix,
  a: Affine3DMatrix,
  b: Affine3DMatrix,
) {
  'worklet';
  const a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3],
    a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7],
    a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11],
    a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];

  let b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
}

export function translate3d(
  matrix: Affine3DMatrix,
  x: number,
  y: number,
  z: number,
): Affine3DMatrix {
  'worklet';
  const change = createIdentityMatrix();
  change[12] = x;
  change[13] = y;
  change[14] = z;
  multiplyInto(change, change, matrix);
  return change;
}

export function rotateZ(
  matrix: Affine3DMatrix,
  radians: number,
  x: number,
  y: number,
  z: number,
): Affine3DMatrix {
  'worklet';
  const change = createIdentityMatrix();
  change[0] = Math.cos(radians);
  change[1] = Math.sin(radians);
  change[4] = -Math.sin(radians);
  change[5] = Math.cos(radians);

  let combined = createIdentityMatrix();
  combined = translate3d(combined, -x, -y, -z);
  multiplyInto(combined, change, combined);
  combined = translate3d(combined, x, y, z);
  multiplyInto(combined, matrix, combined);
  return combined;
}

export function scale3d(
  matrix: Affine3DMatrix,
  xScale: number,
  yScale: number,
  zScale: number,
  x: number,
  y: number,
  z: number,
): Affine3DMatrix {
  'worklet';
  const change = createIdentityMatrix();
  change[0] = xScale;
  change[5] = yScale;
  change[10] = zScale;

  let combined = createIdentityMatrix();
  combined = translate3d(combined, -x, -y, -z);
  multiplyInto(combined, change, combined);
  combined = translate3d(combined, x, y, z);
  multiplyInto(combined, matrix, combined);
  return combined;
}

export function toSkMatrix(m: Affine3DMatrix): SkMatrix {
  return [m[0], m[4], m[12], m[1], m[5], m[13], m[3], m[7], m[15]] as any;
}

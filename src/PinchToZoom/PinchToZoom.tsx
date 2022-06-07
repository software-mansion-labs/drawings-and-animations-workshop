/* eslint-disable @typescript-eslint/no-var-requires */
import type { SkMatrix } from '@shopify/react-native-skia';
import {
  Canvas,
  useImage,
  Image,
  useSharedValueEffect,
  useValue,
  Group,
} from '@shopify/react-native-skia';
import { Dimensions, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { createIdentityMatrix, scale3d, toSkMatrix } from './matrixMath';

const zurich = require('../assets/zurich.jpg');
const { width, height } = Dimensions.get('window');

export const PinchToZoom = () => {
  const image = useImage(zurich);
  if (!image) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector>
        <Canvas style={{ flex: 1 }}>
          <Group>
            <Image
              x={0}
              y={0}
              width={width}
              height={height}
              image={image}
              fit="cover"
            />
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

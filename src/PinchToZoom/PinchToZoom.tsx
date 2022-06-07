/* eslint-disable @typescript-eslint/no-var-requires */
import type { SkMatrix, Transforms2d } from '@shopify/react-native-skia';
import {
  Path,
  useTiming,
  Skia,
  Canvas,
  useImage,
  Image,
  useSharedValueEffect,
  useValue,
  Group,
} from '@shopify/react-native-skia';
import { Dimensions, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { createIdentityMatrix, scale3d, toSkMatrix } from './matrixMath';

const zurich = require('../assets/zurich.jpg');
const { width, height } = Dimensions.get('window');
//const center = vec(width / 2, height / 2);

// function Movable({children}) {
//   const ref = useAnimatedRef();
//   const matrix = useSharedValue(createIdentityMatrix());
//   const styles = useAnimatedStyle(() => {
//     return {
//       transform: [{matrix: matrix.value}],
//     };
//   });

//   const pan = Gesture.Pan().onChange(e => {
//     matrix.value = translate3d(matrix.value, e.changeX, e.changeY, 0);
//   });

//   const rotate = Gesture.Rotation().onChange(e => {
//     matrix.value = rotateZ(matrix.value, e.rotationChange, 0, 0, 0);
//   });

//   return (
//     <GestureDetector gesture={Gesture.Simultaneous(rotate, scale, pan)}>
//       <Animated.View>
//         <Animated.View style={[{position: 'absolute'}, styles]} ref={ref}>
//           {children}
//         </Animated.View>
//       </Animated.View>
//     </GestureDetector>
//   );
// }

export const PinchToZoom = () => {
  // const focalX = useSharedValue(0);
  // const focalY = useSharedValue(0);
  // const scale = useSharedValue(1);

  const matrix = useSharedValue(createIdentityMatrix());

  const skMatrix = useValue<SkMatrix>(toSkMatrix(createIdentityMatrix()));

  const scale = Gesture.Pinch().onChange((e) => {
    console.log('FOCAL', e.focalX, e.focalY);
    matrix.value = scale3d(
      matrix.value,
      e.scaleChange,
      e.scaleChange,
      1,
      e.focalX,
      e.focalY,
      0
    );
  });

  const image = useImage(zurich);
  useSharedValueEffect(() => {
    skMatrix.current = toSkMatrix(matrix.value);
  }, matrix);
  if (!image) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={scale}>
        <Canvas style={{ flex: 1 }}>
          <Group matrix={skMatrix} transform={[]}>
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

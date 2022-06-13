/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Path,
  Skia,
  SkMatrix,
  useTouchHandler,
} from '@shopify/react-native-skia';
import {
  Canvas,
  useImage,
  Image,
  useSharedValueEffect,
  useValue,
  Group,
} from '@shopify/react-native-skia';
import { Button, Dimensions, Pressable, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
  measure,
  runOnJS,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Icon from '@expo/vector-icons/MaterialIcons';
import { cloneElement, ReactNode, useLayoutEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import {
  createIdentityMatrix,
  rotateZ,
  scale3d,
  toSkMatrix,
  translate3d,
} from '../components/matrixMath';
import { ReactLogo } from './ReactLogo';
import { SkiaLogo } from './SkiaLogo';
import { AppjsLogo } from './AppjsLogo';

const zurich = require('../assets/zurich.jpg');
const { width, height } = Dimensions.get('window');

function Movable({ children }: { children: ReactNode }) {
  const ref = useAnimatedRef();
  const matrix = useSharedValue(createIdentityMatrix());
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ matrix: matrix.value }],
    };
  });

  const pan = Gesture.Pan().onChange((e) => {
    matrix.value = translate3d(matrix.value, e.changeX, e.changeY, 0);
  });

  const rotate = Gesture.Rotation().onChange((e) => {
    matrix.value = rotateZ(matrix.value, e.rotationChange, 0, 0, 0);
  });

  const scale = Gesture.Pinch().onChange((e) => {
    matrix.value = scale3d(
      matrix.value,
      e.scaleChange,
      e.scaleChange,
      1,
      0,
      0,
      0
    );
  });

  return (
    <GestureDetector gesture={Gesture.Simultaneous(rotate, scale, pan)}>
      <Animated.View>
        <Animated.View style={[{ position: 'absolute' }, styles]} ref={ref}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

function PickerItem({ addItem, children }) {
  return (
    <Pressable
      onPress={() =>
        addItem(cloneElement(children, { width: 200, height: 200 }))
      }>
      <View style={{ marginRight: 10 }}>{children}</View>
    </Pressable>
  );
}

const WIDTH = 50;
const ICONS_COUNT = 3;
const TOSS_TIME_SEC = 0.1;

function snapPoint(x, vx) {
  'worklet';
  const WIDTH = 50 + 10;
  x = x + vx * TOSS_TIME_SEC;
  const position = Math.max(
    -ICONS_COUNT + 1,
    Math.min(0, Math.round(x / WIDTH))
  );
  console.log('POSITION', position);
  return position * WIDTH;
}

function Toolbar({ addItem }) {
  const filterOffset = useSharedValue(0);
  const pan = Gesture.Pan()
    .onChange((e) => {
      filterOffset.value += e.changeX;
    })
    .onEnd((e) => {
      filterOffset.value = withSpring(
        snapPoint(filterOffset.value, e.velocityX),
        {
          velocity: e.velocityX,
        }
      );
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: filterOffset.value }],
    };
  });
  return (
    <View
      style={{
        overflow: 'visible',
        position: 'absolute',
        bottom: 50,
        width: 0,
      }}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              width: WIDTH * ICONS_COUNT,
              marginLeft: -WIDTH / 2,
            },
            styles,
          ]}>
          <PickerItem addItem={addItem}>
            <ReactLogo width={WIDTH} height={WIDTH} />
          </PickerItem>
          <PickerItem addItem={addItem}>
            <SkiaLogo width={WIDTH} height={WIDTH} />
          </PickerItem>
          <PickerItem addItem={addItem}>
            <AppjsLogo width={WIDTH} height={WIDTH} />
          </PickerItem>
        </Animated.View>
      </GestureDetector>
      <Icon
        style={{ position: 'absolute', bottom: -20, left: -10 }}
        name="expand-less"
        size={20}
      />
    </View>
  );
}

export const Stickers = ({ navigation }) => {
  const [items, setItems] = useState([] as ReactNode[]);

  const addItem = (item: ReactNode) => {
    setItems([...items, item]);
  };

  const path = useValue(Skia.Path.Make());
  const onTouch = useTouchHandler({
    onStart: ({ x, y }) => {
      path.current.moveTo(x, y);
    },
    onActive: ({ x, y }) => {
      const lastPt = path.current.getLastPt();
      const xMid = (lastPt.x + x) / 2;
      const yMid = (lastPt.y + y) / 2;
      path.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
    },
  });

  const [imageUri, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Photo" onPress={pickImage} />,
    });
  }, [navigation]);

  const image = useImage(imageUri || zurich);
  if (!image) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
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
      <View
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        pointerEvents="box-none">
        {items.map((item, index) => (
          <Movable key={index}>{item}</Movable>
        ))}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 120,
          alignItems: 'center',
          backgroundColor: '#ffffff55',
        }}>
        <Toolbar addItem={addItem} />
      </View>
    </View>
  );
};

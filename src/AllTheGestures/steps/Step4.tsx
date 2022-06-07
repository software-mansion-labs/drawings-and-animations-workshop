import React, { useState, ReactNode } from 'react';
import { ColorValue, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  withTiming,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  useAnimatedRef,
  withDelay,
  runOnJS,
  measure,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  createIdentityMatrix,
  rotateZ,
  scale3d,
  translate3d,
} from '../components/matrixMath';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

type Frame = { x: number; y: number; width: number; height: number };
type AddItemCallback = (icon: string, color: ColorValue, frame: Frame) => void;

const WIDTH = 50;

function Sticker({
  iconName,
  color,
  addItem,
}: {
  iconName: string;
  color: ColorValue;
  addItem: AddItemCallback;
}) {
  const iconRef = useAnimatedRef();
  function addItemFromUI() {
    'worklet';
    const size = measure(iconRef);
    runOnJS(addItem)(iconName, color, {
      x: size.pageX,
      y: size.pageY,
      width: size.width,
      height: size.height,
    });
  }
  const scale = useSharedValue(1);
  const tap = Gesture.Tap().onEnd(() => {
    addItemFromUI();
  });
  const longPress = Gesture.Tap()
    .maxDuration(1e8)
    .onBegin(() => {
      scale.value = withDelay(50, withTiming(3, { duration: 2000 }));
    })
    .onEnd(() => {
      addItemFromUI();
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      zIndex: scale.value > 1 ? 100 : 1,
    };
  });
  return (
    <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
      <AnimatedIcon
        name={iconName}
        size={WIDTH}
        color={color}
        style={styles}
        ref={iconRef}
      />
    </GestureDetector>
  );
}

const STICKERS_COUNT = 4;

function snapPoint(x: number, vx: number) {
  'worklet';
  const tossX = x + vx * 0.1; // simulate movement for 0.1 second
  const position = Math.max(
    -STICKERS_COUNT + 1,
    Math.min(0, Math.round(tossX / WIDTH))
  );
  return position * WIDTH;
}

function Toolbar({ addItem }: { addItem: AddItemCallback }) {
  const offsetY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onChange((e) => {
      offsetY.value += e.changeX;
    })
    .onEnd((e) => {
      offsetY.value = withSpring(snapPoint(offsetY.value, e.velocityX), {
        velocity: e.velocityX,
      });
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetY.value }],
    };
  });
  return (
    <View
      style={{
        overflow: 'visible',
        width: 0,
      }}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            { flexDirection: 'row', width: WIDTH * 4, marginLeft: -WIDTH / 2 },
            styles,
          ]}>
          <Sticker iconName="favorite" color="#ffaaa8" addItem={addItem} />
          <Sticker iconName="grade" color="#001a72" addItem={addItem} />
          <Sticker iconName="thumb-up" color="#ffee86" addItem={addItem} />
          <Sticker iconName="emoji-events" color="#8ed3ef" addItem={addItem} />
        </Animated.View>
      </GestureDetector>
      <Icon
        style={{ position: 'absolute', bottom: -30, left: -15 }}
        name="expand-less"
        size={30}
      />
    </View>
  );
}

function Movable({ children }: { children: ReactNode }) {
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
        <Animated.View style={[{ position: 'absolute' }, styles]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export function AllTheGestures() {
  const [items, setItems] = useState([] as ReactNode[]);

  const addItem = (icon: string, color: ColorValue, frame: Frame) => {
    setItems([
      ...items,
      <AnimatedIcon name={icon} color={color} size={frame.width} />,
    ]);
  };

  return (
    <View style={{ width: '100%', height: '100%' }}>
      {items.map((item, index) => (
        <Movable key={index}>{item}</Movable>
      ))}
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: '100%',
          alignItems: 'center',
        }}>
        <Toolbar addItem={addItem} />
      </View>
    </View>
  );
}

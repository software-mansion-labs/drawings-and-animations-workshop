import React, { useEffect, useRef, useState } from 'react';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CenterScreen } from '../components/CenterScreen';
import { Pressable, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const WIDTH = 50;

function Sticker({ iconName }: { iconName: string }) {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <Pressable onPress={() => setSelected(!selected)}>
        <AnimatedIcon
          key={selected ? 1 : 0}
          name={iconName}
          size={WIDTH}
          color={selected ? '#ffaaa8' : '#aaa'}
        />
      </Pressable>
    </>
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

function Toolbar() {
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
          <Sticker iconName="favorite" />
          <Sticker iconName="grade" />
          <Sticker iconName="thumb-up" />
          <Sticker iconName="emoji-events" />
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

export function GestureBasedPicker() {
  return (
    <CenterScreen>
      <Toolbar />
    </CenterScreen>
  );
}

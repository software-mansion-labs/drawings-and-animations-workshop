/* eslint-disable @typescript-eslint/no-var-requires */
import type { SkMatrix } from "@shopify/react-native-skia";
import {
  Canvas,
  useImage,
  Image,
  useSharedValueEffect,
  useValue,
  Group,
} from "@shopify/react-native-skia";
import { Dimensions, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedRef,
  measure,
  runOnJS,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import Icon from "@expo/vector-icons/MaterialIcons";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import {
  createIdentityMatrix,
  rotateZ,
  scale3d,
  toSkMatrix,
  translate3d,
} from "../components/matrixMath";

const zurich = require("../assets/zurich.jpg");
const { width, height } = Dimensions.get("window");

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function moveInFrom({ x, y, width, height }) {
  return (values) => {
    "worklet";
    const startScale = width / values.targetWidth;
    const startX =
      x - values.targetGlobalOriginX - (values.targetWidth - width) / 2;
    const startY =
      y - values.targetGlobalOriginY - (values.targetHeight - height) / 2;
    const config = { duration: 600 };
    const animations = {
      originX: withTiming(values.targetOriginX, config),
      originY: withTiming(values.targetOriginY, config),
      transform: [{ scale: withTiming(1, config) }],
    };
    const initialValues = {
      originX: startX,
      originY: startY,
      transform: [{ scale: startScale }],
    };
    return { initialValues, animations };
  };
}

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
        <Animated.View style={[{ position: "absolute" }, styles]} ref={ref}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

function Tool({ icon = "favorite", addItem }) {
  const [faved, setFaved] = useState(false);
  const iconRef = useAnimatedRef();
  const color = faved ? "#900" : "#aaa";
  const scale = useSharedValue(1);
  const addItemWorklet = () => {
    "worklet";
    const size = measure(iconRef);
    runOnJS(addItem)(icon, {
      x: size.pageX,
      y: size.pageY,
      width: size.width,
      height: size.height,
    });
  };
  const tap = Gesture.Tap().onEnd(() => {
    addItemWorklet();
  });

  const longPress = Gesture.LongPress()
    .onStart(() => {
      scale.value = withTiming(2, { duration: 2000 });
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      // runOnJS(setFaved)(!faved);
      addItemWorklet();
    });
  const styles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      color: withTiming(color),
    };
  });
  return (
    <GestureDetector gesture={Gesture.Exclusive(tap, longPress)}>
      <AnimatedIcon name={icon} size={30} style={styles} ref={iconRef} />
    </GestureDetector>
  );
}

const WIDTH = 30;
const ICONS_COUNT = 4;
const TOSS_TIME_SEC = 0.1;

function snapPoint(x, vx) {
  "worklet";
  x = x + vx * TOSS_TIME_SEC;
  const position = Math.max(
    -ICONS_COUNT + 1,
    Math.min(0, Math.round(x / WIDTH))
  );
  console.log("POSITION", position);
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
        overflow: "visible",
        position: "absolute",
        bottom: 50,
        width: 0,
      }}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              width: WIDTH * ICONS_COUNT,
              marginLeft: -WIDTH / 2,
            },
            styles,
          ]}
        >
          <Tool icon="favorite" addItem={addItem} />
          <Tool icon="grade" addItem={addItem} />
          <Tool icon="thumb-up" addItem={addItem} />
          <Tool icon="emoji-events" addItem={addItem} />
        </Animated.View>
      </GestureDetector>
      <Icon
        style={{ position: "absolute", bottom: -20, left: -10 }}
        name="expand-less"
        size={20}
      />
    </View>
  );
}

export const Stickers = () => {
  const [items, setItems] = useState([]);
  const matrix = useSharedValue(createIdentityMatrix());

  const addItem = useCallback(
    (icon, frame) => {
      setItems([
        ...items,
        <AnimatedIcon
          name={icon}
          color="#900"
          size={150}
          entering={moveInFrom(frame)}
        />,
      ]);
    },
    [items]
  );

  const skMatrix = useValue<SkMatrix>(toSkMatrix(createIdentityMatrix()));

  const scale = Gesture.Pinch().onChange((e) => {
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
      <View
        style={{ width: "100%", height: "100%", position: "absolute" }}
        pointerEvents="box-none"
      >
        {items.map((item, index) => (
          <Movable key={index}>{item}</Movable>
        ))}
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Toolbar addItem={addItem} />
      </View>
    </View>
  );
};

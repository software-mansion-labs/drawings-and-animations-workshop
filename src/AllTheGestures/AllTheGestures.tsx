import React, { ReactNode } from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

function Movable({ children }: { children: ReactNode }) {
  return (
    <GestureDetector>
      <Animated.View>
        <Animated.View style={[{ position: 'absolute' }]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export function AllTheGestures() {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Movable>
        <AnimatedIcon name="favorite" color="#ffaaa8" size={150} />
      </Movable>
    </View>
  );
}

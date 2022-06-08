# Dragging, rotating, and pinchin + custom Layout Animation combo

In this section we build a "canvas" canvas component, where stickers can be added, moved, and rotated.

## Step 1 – Building canvas

![3 1 mp4](https://user-images.githubusercontent.com/726445/172513362-3f7dab44-fb09-4085-a558-71ba5515a237.gif)

<details>
<summary><b>[1]</b> Create a full-screen “canvas” component (just a View for now) and render one of the stickers in it</summary>

Start with the following component as a base:

```js
export function AllTheGestures() {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <AnimatedIcon name="favorite" color="#ffaaa8" size={150} />
    </View>
  );
}
```

</details></br>

<details>
<summary><b>[2]</b> Add GestureDetector with pan gesture to it, such that you can move the icon around the canvas – use <code>translateX</code> and <code>translateY</code> + <code>onChange</code> event callback for the gesture</summary>

Let us create a separate component called `Movable` that implements this logic.
We start by defining it and rendering gesture detector:

```js
function Movable({ children }: { children: ReactNode }) {
  return (
    <GestureDetector>
      <Animated.View style={{ position: 'absolute' }}>{children}</Animated.View>
    </GestureDetector>
  );
}
```

Now, let us create a shared value that'd store the position and use it in `useAnimatedStyle`:

```js
const position = useSharedValue({ x: 0, y: 0 });
const styles = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
    ],
  };
});
```

Remember to connect styles to the anikmated component that we want to transform:

```js
return (
  <GestureDetector>
    <Animated.View style={[{ position: 'absolute' }, styles]}>
      {children}
    </Animated.View>
  </GestureDetector>
);
```

Finally, we define new `Pan` gesture instance and implement `onChange` handler to offset the position:

```js
const pan = Gesture.Pan().onChange((e) => {
  const { x, y } = position.value;
  position.value = { x: x + e.changeX, y: y + e.changeY };
});
```

Again, we need to remember to pass the created gesture as a configuration to `GestureDetector`:

```js
return (
  <GestureDetector gesture={pan}>
    <Animated.View style={[{ position: 'absolute' }, styles]}>
      {children}
    </Animated.View>
  </GestureDetector>
);
```

</details></br>

## Step 2 – Using matrices

![3 1 mp4](https://user-images.githubusercontent.com/726445/172513391-3487879c-bdf6-40cc-afe1-3d7a86c0c519.gif)

<details>
<summary><b>[1]</b> Refactor movable component to use matrix – this will allow for more complex modifications in the future (check out hints for matrix math code)</summary>

Rename `position` shared value to `matrix`, and initialize it with identity matrix created with `createIdentityMatrix()` from `matrixMath.ts` helper file.

```js
const matrix = useSharedValue(createIdentityMatrix());
```

Update animated styles to use `matrix` transform instead of separate `translateX` and `translateY` transforms:

```js
const styles = useAnimatedStyle(() => {
  return {
    transform: [{ matrix: matrix.value }],
  };
});
```

Finally, in gesture `onChange` callback, we can now use `translate3d` helper method that takes current transform matrix and new offsets and outpus new combined matrix translated by the provided 3d vecrtor:

```js
const pan = Gesture.Pan().onChange((e) => {
  matrix.value = translate3d(matrix.value, e.changeX, e.changeY, 0);
});
```

</details></br>

## Step 3 – Scale and rotate

![3 3 mp4](https://user-images.githubusercontent.com/726445/172513412-4b8c369f-7ef8-4eda-a326-f046027578d5.gif)

<details>
<summary><b>[1]</b> Add pinch and rotate gesture to control size and orientation of the icon</summary>

Creane new `Rotate` gesture instance and use `rotateZ` helper method to transform the matrix in `onChange` handler:

```js
const rotate = Gesture.Rotation().onChange((e) => {
  matrix.value = rotateZ(matrix.value, e.rotationChange, 0, 0, 0);
});
```

Similarily, for the scale gesture create new `Pinch` instance and use `scale3d` helper method:

```js
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
```

Finally, connect all the gestures together into `GestureDetector` component:

```js
<GestureDetector gesture={Gesture.Simultaneous(rotate, scale, pan)}>
```

</details></br>

<details>
<summary><b>[BONUS 1]</b> Add two-finger-pan gesture to rotate along X or Y axis (3D rotation)</summary>

Take a look at `rotateZ` method and try to come up with a symmetric version that performs the rotation along the X or Y axis.
Note that with rotation, the event data contains an angle, while with two finger pan you'll be getting number that corresponds to distance.

</details></br>

## Step 4 – Items collection

![3 4 mp4](https://user-images.githubusercontent.com/726445/172513438-b1c399e8-b921-4970-853b-fdc93e27f246.gif)

<details>
<summary><b>[1]</b> Bring the picker component built in the previous excercise and render it at the bottom of the</summary>

In this step, you can copy code from [GestureBasedPicker.tsx](../GestureBasedPicker/steps/Step5.tsx) – only copy `Toolbar` component and things it depends on.

Render the toolbar at the bottom of the screen such that it is also centered:

```js
export function AllTheGestures() {
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <Movable>
        <AnimatedIcon name="favorite" color="#ffaaa8" size={150} />
      </Movable>
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          width: '100%',
          alignItems: 'center',
        }}>
        <Toolbar />
      </View>
    </View>
  );
}
```

</details></br>

<details>
<summary><b>[2]</b> Refactor canvas component to keep a list of displayed items in a state variable</summary>

Add local state that keeps a list of added items:

```js
const [items, setItems] = useState([]);
```

Then render the items:

```js
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
```

</details></br>

<details>
<summary><b>[3]</b> Make toolbar buttons add new items to the canvas on click – both on tap and on long press. Use <a href="https://docs.swmansion.com/react-native-reanimated/docs/next/api/nativeMethods/measure"><code>measure</code></a> method to pass icon's dimensions such that we can add bigger strickers by long pressing them</summary>

First, let us define a method that adds new items to the list. We will then pass that method down to individual icons for them to call it. The method will take the basic icon configuration like shape name and color, and also the frame of the icon that we will use to determine the size of it:

```js
const addItem = (icon, color, frame) => {
  setItems([
    ...items,
    <AnimatedIcon name={icon} color={color} size={frame.width} />,
  ]);
};
```

Refactor `Toolbar` and `Sticker` component to take `addItem` callback as prop, and pass the method down to each of the `Sticker` instaces.

In order to call `addItem` we need to get the dimensions of the icon that is clicked.
For this purpose we will use `measure` method from `react-naitve-reanimated`.
In order to call `measure`, we need to first define a "ref" object with `useAnimatedRef`:

```js
const iconRef = useAnimatedRef();
```

Later, we assign it to the component we want to measure using React's `ref` property:

```js
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
```

Now we can add a call to `addItem` to `onEnd` callbacks for `Tap` and `LongPress` gestures.
However, since gesture callbacks run on ths UI thread, we need to use `runOnJS` helper from `react-native-reanimated` to execute that callback.
To avoid code duplication, we can define a helper method that measures the icon and calls the callback:

```js
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
```

Finally, we can call this helper method from `onEnd` gesture callbacks:

```js
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
```

</details></br>

## Step 5 – Final Layout Animations touch

![3 5 mp4](https://user-images.githubusercontent.com/726445/172513465-5a1e3866-76c1-4694-a735-7b1666ea182e.gif)

<details>
<summary><b>[1]</b> Add <a href="https://docs.swmansion.com/react-native-reanimated/docs/next/api/LayoutAnimations/customAnimations#custom-entering-animation">custom entering animation</a> for the new items from canvas such that they slide in from the position on the toolbar (use previously measured dimensions to get the initial position for the animation)</summary>

For this custom entering animation we will animate `originX` and `originY` properties.
We want the view to start animate from the toolbar and then move to the final destination on the canvas.
Since we measure the icon, we know it's top-left corner position in relative to the screen.
However, `originX` and `originY` correspond to the center position of the view relative to its parent.
In order to convert between these two, we can use `targetGlobalOriginX` attribute that the animation callback receives in the `values` object, and that corresponds to the center position of the view but relative to the screen.

Now, the starting center of the view relative to the canvas item parent can be calculated as:

```js
const startX =
  x - values.targetGlobalOriginX - (values.targetWidth - width) / 2;
```

Similarily, for the Y coordinate we get:

```js
const startY =
  y - values.targetGlobalOriginY - (values.targetHeight - height) / 2;
```

As a result, the initial values for the entering animation can be defined as follows:

```js
const initialValues = {
  originX: startX,
  originY: startY,
};
```

Now, we need to specify how the animation should be performed.
This is defined by the `animations` object that consists of keys corresponding to the prop being animated.
In our case we want a simple timing animation to the view's target positions:

```js
const config = { duration: 600 };
const animations = {
  originX: withTiming(values.targetOriginX, config),
  originY: withTiming(values.targetOriginY, config),
};
```

Now, the complete entering animation should look as follows:

```js
function moveInFrom({ x, y, width, height }) {
  return (values) => {
    'worklet';
    const startX =
      x - values.targetGlobalOriginX - (values.targetWidth - width) / 2;
    const startY =
      y - values.targetGlobalOriginY - (values.targetHeight - height) / 2;
    const config = { duration: 600 };
    const animations = {
      originX: withTiming(values.targetOriginX, config),
      originY: withTiming(values.targetOriginY, config),
    };
    const initialValues = {
      originX: startX,
      originY: startY,
    };
    return { initialValues, animations };
  };
}
```

We can now use this animation for our new component that we add to the items state array:

```js
const addItem = (icon: string, color: ColorValue, frame: Frame) => {
  setItems([
    ...items,
    <AnimatedIcon
      name={icon}
      color={color}
      size={frame.width}
      entering={moveInFrom(frame)}
    />,
  ]);
};
```

</details></br>

<details>
<summary><b>[BONUS 1]</b> Make the slide-in animation go along some curve and not just along the straight path</summary>

😈

</details></br>

## Next step

**Go to: [Drawings – React Logo](../ReactLogo/)**

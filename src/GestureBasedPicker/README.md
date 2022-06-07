# Gestrue-based Picker

In this excercise we build a gesture-based horizontal picker.
Along the way of building it, we explore the new gesture-handler v2 library API in details.

## Step 1 - Building a toolbar

<details>
<summary><b>[1]</b> Add three more icons in a single row (use different icons, for example “grade”, “thumb-up”, “emoji-events”)</summary>

We will reuse `Heart` component from the previous excercise but refactor it such that it takes icon name as a prop:

```js
function Sticker({ iconName }) {
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
```

Now, we create a new component called `Toolbar` that renders `GestureDetector` component that wraps a horizontally oriented view in which we render a bunch of `Sticker` instances:

```js
function Toolbar() {
  return (
    <View
      style={{
        overflow: 'visible',
        width: 0,
      }}>
      <GestureDetector>
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
    </View>
  );
}
```

</details></br>

<details>
<summary><b>[2]</b> Wrap the row in GestureDetector and create a pan gesture for sliding the icons row along the X axis (with translateX transform)</summary>

We start by defining new shared value that will track the horizontal offset of the toolbar, and make animated style to map it to the appropriate transform

```js
const offsetY = useSharedValue(0);
const styles = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offsetY.value }],
  };
});
```

Now, we define pan gesture logic.
We update offset with the amount of movement provided by the gesture `onChange` handler.

```js
const pan = Gesture.Pan().onChange((e) => {
  offsetY.value += e.changeX;
});
```

Finally, we need to configure our `GestureDetector` to process the defined pan gesture logic:

```js
<GestureDetector gesture={pan}>
```

</details></br>

## Step 2 – Snapping

<details>
<summary><b>[1]</b> Add an indicator outside of the sliding bar to point to the first icon (you can use “expand-less” icon for a chevron pointing up)</summary>

The indicator component can look as follow – just put it under the sliding view:

```js
<Icon
  style={{ position: 'absolute', bottom: -30, left: -15 }}
  name="expand-less"
  size={30}
/>
```

</details></br>

<details>
<summary><b>[2]</b> Add snapping logic such that the the bar can only stop at the position where one of the icon is directly over the indicator (use <code>withSpring</code> animation in <code>onEnd</code> gesture callback)</summary>

Let us first define a helper method that takes the current offset and returns the offset to which the picker should snap to.
Since we will use the method on the UI thread (from gesture handler callbacks), it needs to be annotated with `'worklet'` directive:

```js
const STICKERS_COUNT = 4;
const WIDTH = 50;

function snapPoint(x: number) {
  'worklet';
  const position = Math.max(
    -STICKERS_COUNT + 1,
    Math.min(0, Math.round(x / WIDTH))
  );
  return position * WIDTH;
}
```

In the above method we rely on the known number of stickers and their fixed sizes.

Next, we add an `onEnd` handler to the pan gesture in where we will calculate the snap point and initiate the animation.

```js
const pan = Gesture.Pan()
  .onChange((e) => {
    offsetY.value += e.changeX;
  })
  .onEnd((e) => {
    offsetY.value = withSpring(snapPoint(offsetY.value));
  });
```

</details></br>

## Step 3 – Moar physics

<details>
<summary><b>[1]</b> Make fling gestures feel more natural by transfering the speed of the fling onto the snap animation</summary>

In this step the only thing is to pass initial velocity as a parameter for spring animation. The velocity is provided as one of the fields of the end gesture.

```js
  .onEnd((e) => {
    offsetY.value = withSpring(snapPoint(offsetY.value), {
      velocity: e.velocityX,
    });
  });
```

</details></br>

<details>
<summary><b>[2]</b> Implement toss effect (when you lift finger from swiping at speed) – use velocity from gesture event to “simulate” further movement for 100ms</summary>

Let us update the previously implemented `snapPoint` method and add current velocity as a second parameter.
Now, instead of just looking at offset position `x`, we "simulate" a movement with constant velocity for some short time duration:

```js
function snapPoint(x: number, vx: number) {
  'worklet';
  const tossX = x + vx * 0.1; // simulate movement for 0.1 second
  const position = Math.max(
    -STICKERS_COUNT + 1,
    Math.min(0, Math.round(tossX / WIDTH))
  );
  return position * WIDTH;
}
```

Update callsite of `snapPoint` method to pass the velocity:

```js
  .onEnd((e) => {
    offsetY.value = withSpring(snapPoint(offsetY.value, e.velocityX), {
      velocity: e.velocityX,
    });
  });
```

</details></br>

<details>
<summary><b>[BONUS 1]</b> Add friction when swiping – the bar moves slower the further you drag – this way to only allow swiping between adjacent icons</summary>

In this step you should not only look at the pan event change but also on the distance from the central point.
Then take that into account when updating the offset.
Without a friction, pan change corresponds to the exact same change in the offset, with friction you want the offset to move less than pan and to slow down exponentially the further from the center the finger is.
Note that friction should also be added when simulating "toss" as to avoid fast swipes to jump between stickers.

</details></br>

## Step 4 – Refactor to LongPress gesture

<details>
<summary><b>[1]</b> Remove icon’s state and all effects added previously</summary>
🙃 try not to use hints this often
</details></br>

<details>
<summary><b>[2]</b> Replace Pressable with GestureDetector and add LongPress gesture that makes the icon “grow” up to 3x scale, then go back to normal after finger is lifted</summary>

We refactor `Sticker` component to now render `AnimatedIcon` wrapped with `GestureDetector` component.
For `GestureDetector`, we prepare two separate gestures: tap and long press.
We set up tap gesture to do nothing for the time being, and for long press gesture we want it to make the sticker "grow".
For that purpose we start animating scale in `onStart` gesture, in order to "cancel" it when the finger is lifted, we

</details></br>

<details>
<summary><b>[3]</b> Make sure that sticker that is being long press is displayed over all the other stickers – use zIndex in <code>useAnimatedStyle</code> for this purpose</summary>

We refactor `Sticker` component to now render `AnimatedIcon` wrapped with `GestureDetector` component.
For `GestureDetector`, we prepare two separate gestures: tap and long press.
We set up tap gesture to do nothing for the time being, and for long press gesture we want it to make the sticker "grow".
For that purpose we start animating scale in `onStart` gesture, in order to "cancel" it when the finger is lifted, we start animation back to 1 from `onEnd` callback.

```js
function Sticker({ iconName, color }: { iconName: string, color: ColorValue }) {
  const tap = Gesture.Tap().onEnd(() => {
    console.log('Do nothing yet');
  });
  const scale = useSharedValue(1);
  const longPress = Gesture.LongPress()
    .onStart(() => {
      scale.value = withTiming(3, { duration: 2000 });
    })
    .onEnd(() => {
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
      <AnimatedIcon name={iconName} size={WIDTH} color={color} style={styles} />
    </GestureDetector>
  );
}
```

</details></br>

## Step 5 – Control gesture activation criteria

<details>
<summary><b>[1]</b> Note what happens to the bar swiping when long press gesture is active?</summary>

Long press captures the event stream and does not allow swipe gesture to activate.

</details></br>

<details>
<summary><b>[2]</b> Allow pan to activate after long pressing the sticker – the easiest approach is to use Tap instead of LongPress (checkout <code>onBegin</code> callback and <code>maxDuration</code> option)</summary>

We refactor long press handler to use `Tap` gesture directly, this way we avoid `LongPress` gesture from activating (and therefore cancelling swipe gesture) when we hold the finger still for a few moments.
However, because `Tap` will now no longer activate, we can't use `onStart` callback with it as it would only be triggered when we finish the tap (lift the finger up).
For this reason we use `onBegin` which is called immediately when gesture handler starts receiving touch stream.
Now, in order to not start the scale-up animation too soon, we add `withDelay` to prevent the situation when "just swiping" still initiates the scaling.
Finally, we need to set `maxDuration` option to some big number, as otherwise the tap gesture would be cancelled shortly after holding the finger still:

```js
const longPress = Gesture.Tap()
  .maxDuration(1e8)
  .onBegin(() => {
    scale.value = withDelay(50, withTiming(3, { duration: 2000 }));
  })
  .onFinalize(() => {
    scale.value = withSpring(1);
  });
```

</details></br>

## Next step

**Go to [Drag and Drop (and Rotate, and Pinch)](../AllTheGestures)**

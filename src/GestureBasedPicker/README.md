# Drawings, gestures, and animations workshop – App.js Conference 2022

## Hosted by

- William Candillon ([@wcandillon](https://twitter.com/wcandillon))
- Krzysztof Magiera ([@kzzzf](https://twitter.com/kzzzf))

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

</details></br>

## Step 10 – Snapping

<details>
<summary><b>[1]</b> Add an indicator outside of the sliding bar to point to the first icon (you can use “expand-less” icon for a chevron pointing up)</summary>
</details></br>

<details>
<summary><b>[2]</b> Add snapping logic such that the the bar can only stop at the position where one of the icon is directly over the indicator (use withSpring animation in onEnd gesture callback)</summary>
</details></br>

## Step 11 – Moar physics

<details>
<summary><b>[1]</b> Implement toss effect (when you lift finger from swiping at speed) – use velocity from gesture event to “simulate” further movement for 100ms</summary>
</details></br>

<details>
<summary><b>[BONUS 1]</b> Add friction when swiping – the bar moves slower the further you drag – this way to only allow swiping between adjacent icons</summary>
</details></br>

## Step 12 – Refactor to LongPress gesture

<details>
<summary><b>[1]</b> Remove icon’s state and all effects added previously</summary>
🙃 try not to use hints this often
</details></br>

<details>
<summary><b>[2]</b> Replace Pressable with GestureDetector and add LongPress gesture that makes the icon “grow” up to 1.4 scale, then go back to normal after finger is lifted</summary>
</details></br>

## Step 13 – Control gesture activation criteria

<details>
<summary><b>[1]</b> Note what happens to the bar swiping when long press gesture is active</summary>
</details></br>

<details>
<summary><b>[2]</b> Allow pan to activate after holding one of the icons for a while – use <code>manualActivation</code> for <code>LongPress</code> gesture to prevent it from activating prematurely (and cancelling pan) and move “growing” logic to <code>onBegin</code> callback</summary>
</details></br>

## Step 14 – Building canvas

<details>
<summary><b>[1]</b> Create a full-screen “canvas” component (just a View for now) and render one of the icon in it</summary>
</details></br>

<details>
<summary><b>[2]</b> Add GestureDetector with pan gesture to it, such that you can move the icon around the canvas – use translateX and translateY + onChange event callback for the gesture</summary>
</details></br>

## Step 15 – Using matrices

<details>
<summary><b>[1]</b> Refactor movable component to use matrix – this will allow for more complex modifications in the future (check out hints for matrix math code)</summary>
</details></br>

## Step 16 – Scale and rotate

<details>
<summary><b>[1]</b> Add pinch and rotate gesture to control size and orientation of the icon</summary>
</details></br>

<details>
<summary><b>[BONUS 1]</b> Add two-finger-pan gesture to rotate along X or Y axis (3D rotation)</summary>
</details></br>

## Step 17 – Items collection

<details>
<summary><b>[1]</b> Refactor canvas component to keep a list of items it shows</summary>
</details></br>

<details>
<summary><b>[2]</b> Make icons from the toolbar add new items to the canvas on click (use tap gesture for that)</summary>
</details></br>

## Step 18 – Final Layout Animations touch

<details>
<summary><b>[1]</b> Add custom entering animation for the new items from canvas such that they slide in from the position on the toolbar (use reanimated’s measure method to get position and size of the button on toolbar and pass that to the method that adds new canvas items)</summary>
</details></br>

<details>
<summary><b>[BONUS 1]</b> Make the slide-in animation go along some curve and not just along the straight path</summary>
</details></br>

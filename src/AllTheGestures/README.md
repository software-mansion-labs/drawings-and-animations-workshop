# Drawings, gestures, and animations workshop – App.js Conference 2022

## Hosted by

- William Candillon ([@wcandillon](https://twitter.com/wcandillon))
- Krzysztof Magiera ([@kzzzf](https://twitter.com/kzzzf))

## Prerequisites

> TODO: simulator setup

## Step 1 – Setup

> TODO: link to EAS build and instructions how to install it + instructions on how to setup repo

## Step 2 – Animating things off the main thread

<details>
<summary><b>[1]</b> Create a “shared value” and animate view’s scale property when the view is tapped (use Pressable from react-native)
</summary>

Import necessary component from `react-native-reanimated` library

```js
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
```

Define shared values inside of the component with:

```js
const scale = useSharedValue(1);
```

Create "animated style" object thet maps scale value to the transform property:

```js
const styles = useAnimatedStyle(() => {
  return {
    transform: [{ scale: scale.value }],
  };
});
```

Use "Animated" version of the `View` component and pass animated style object to it:

```js
return (
  <Animated.View
    style={[{ width: 50, height: 50, backgroundColor: '#ffaaa8' }, styles]}
  />
);
```

Wrap the view with `Pressable` component from `react-native` and use timing animation to update scale in the `onPress` handler:

```js
return (
  <Pressable
    onPress={() => {
      scale.value = withTiming(scale.value + 0.5);
    }}>
    <Animated.View
      style={[{ width: 50, height: 50, backgroundColor: '#ffaaa8' }, styles]}
    />
  </Pressable>
);
```

</details><br/>

<details>
<summary><b>[2]</b> Play with different animation types and its attributes (<a href="https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withTiming">timing + easing</a>, <a href="https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withSpring">spring</a>)
</summary>

To try out timing and spring animations import the following helper methods from reanimated package:

```js
import { withTiming, Easing, withSpring } from 'react-native-reanimated';
```

Chane the `onPress` handler implementation to use different style of animation. For example, to use plain linear time-based 1 second animation do:

```js
scale.value = withTiming(scale.value + 0.5, {
  duration: 1000,
  easing: Easing.linear,
});
```

To use spring animation instead do:

```js
scale.value = withSpring(scale.value + 0.5);
```

To make the spring bounce a bit more, try adjusting spring parameters:

```js
scale.value = withSpring(scale.value + 0.5, { damping: 3 });
```

</details><br/>

<details>
<summary><b>[3]</b> Use “sequence” API to make the scale return to the initial</summary>

Check out [`withSequence`](https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withSequence) docs side for usage example.

In order for scale to animate to 1.5 and back to 1, replace the `onPress` handler code to update scale as follows:

```js
scale.value = withSequence(withTiming(1.5), withTiming(1));
```

</details><br/>

<details>
<summary><b>[4]</b> Add log statements in render method and in <code>useAnimatedStyle</code> to when each of the method gets called</summary>

Aren't you a bit too lazy? 🤨 Anyways, here is how you add a log statement:

```js
console.log('Hello');
```

Put one in the component's render method and another one (that prints something different) in `useAnimatedStyle` function.
Run the app, and see when each of those logs gets printed (perhaps you may need to look at the terminal to see the logs getting printed).

</details><br/>

<details>
<summary><b>[5]</b> Click the button fast to see how “cancellation” is handled (consider extending the animation duration to see it more clearly)</summary>

In order to make the animation run for longer, just pass `duration` parameter to the timing animation you launch. The duration value is expressed in milliseconds:

```js
withTiming(1.5, { duration: 3000 });
```

</details><br/>

## Step 3 – Animating third-party components

<details>
<summary><b>[1]</b>  Use <code>@expo/vector-icons</code> package to replace <code>View</code> with an <code>Icon</code> component (e.g. use “favorite” icon from <code>MaterialIcons</code> sub-package)</summary>

Import `Icon` component as follows:

```js
import Icon from '@expo/vector-icons/MaterialIcons';
```

And use it later by passing size, color, and the name of the icon:

```js
return <Icon name="favorite" color="#ffaaa8" size={50} />;
```

</details><br/>

<details>
<summary><b>[2]</b>  Use <code>createAnimatedComponent</code> to get “Animated” version of <code>Icon</code> component</summary>

In order to animated `Icon`'s properties you need to use "animated" version of that component.
Much like you use `Animated.View` instead of plain `View` for the built-in RN's view type.
Animated component can be made just once (e.g. assign it to a global variable) and you should use `createAnimatedComponent` from `react-native-reanimated` package for it:

```js
const AnimatedIcon = createAnimatedComponent(Icon);
```

</details><br/>

<details>
<summary><b>[3]</b> Use <code>useAnimatedProps</code> to animate icon’s color in addition to the scale</summary>

Similarily to the scale animation, start by creating a shared value where color is going to be stored:

```js
const color = useSharedValue('#aaa');
```

Later on trigger animation by passing another color:

```js
color.value = withTiming('#ffaaa8');
```

Use `useAnimatedProps` to map `color` shared value onto the `color` property:

```js
const props = useAnimatedProps(() => {
  return {
    color: color.value,
  };
});
```

Finally, pass animated props object to the `Icon` component via `animatedProps` attribute:

```js
return (
  <AnimatedIcon name="favorite" size={50} animatedProps={props}>
)
```

</details><br/>

## Step 4 – Dealing with component state

<details>
<summary><b>[1]</b> Introduce a binary state to your component (with <code>useState</code> from React) and make the button flip between the state</summary>

First, import `useState` hook:

```js
import { useState } from 'react';
```

Next, add state variable to your component:

```js
const [selected, setSelected] = useState(false);
```

Finally, update `onPress` handler to alternate between the states:

```js
onPress={() => setSelected(!selected)}
```

</details><br/>

<details>
<summary><b>[2]</b> Now use state’s variable inside <code>useAnimatedProps</code> section to animate the color</summary>

Instead of having `color` as a separate variable, we can derive icon's color from `selected` state.
Update `useAnimatedStyle` to use one of the colors depending on the state:

```js
useAnimatedProps(() => {
  return {
    color: selected ? '#ffaaa8' : '#aaa',
  };
});
```

</details><br/>

<details>
<summary><b>[3]</b> Use withTiming et al. inside useAnimatedProps to have one source of state</summary>

Wrap value assigned to color prop with `withTiming` or some other animation type in order for the prop change to be animated:

```js
useAnimatedProps(() => {
  return {
    color: withTiming(selected ? '#ffaaa8' : '#aaa'),
  };
});
```

</details><br/>

<details>
<summary><b>[4]</b> Try tapping button fast to see how “cancellation” is handled</summary>

🤡

</details><br/>

## Step 5 – Building on-click effects

<details>
<summary><b>[1]</b> Use <code>useAnimatedReaction</code> to monitor selected state change and run "bounce on tap" animation</summary>

Add `useAnimatedReaction` to the component implementation. First callback provided to the method should return value that we want to monior for changes (in our case that's going to be `selected` state value), in the second callback we execute the reaction -- in our case we want to start animation when state changes from not-selected to selected:

```js
useAnimatedReaction(
  () => selected,
  (isSelected) => {
    if (isSelected) {
      scale.value = withSequence(withTiming(1.5), withTiming(1));
    }
  }
);
```

</details></br>

<details>
<summary><b>[BONUS 1]</b> Change bounce effect to wobble effect using rotation transform</summary>

You are fast, seems like you don't really need hints...

</details></br>

## Step 6 – Layout Animations API

<details>
<summary><b>[1]</b> Use entering animation (e.g. <a href="https://docs.swmansion.com/react-native-reanimated/docs/2.3.x/api/LayoutAnimations/entryAnimations/#bounce"><code>BounceIn</code></a>) along with “key” property to trigger enter animation on state change and replicate the previous effect</summary>

First, cleanup the component code and delete all previously added shared values, animated styles, and props.
In this step we will use [`LayoutAnimation`](https://docs.swmansion.com/react-native-reanimated/docs/tutorials/LayoutAnimations/layoutAnimations) API to replicate similar effect.

We start off by adding imports for the selected `BounceIn` builtin layout animation:

```js
import { BounceIn } from 'react-native-reanimated';
```

Now we can add `entering` property to the animated icon component and pass the selected built-in animation.
Now, in order for `enetring` animation to run on `selected` state change we can use React's `key` prop.
When `key` changes the component is dropped and new component is created to replace the previous one.
This way we can force the icon to run enter animation on state change.

```js
<AnimatedIcon
  key={selected ? 1 : 0}
  name="favorite"
  size={50}
  color={selected ? '#ffaaa8' : '#aaa'}
  entering={BounceIn}
/>
```

</details></br>
<details>
<summary><b>[2]</b> Find exiting animation to make the disappearing version of the icon animate nicely</summary>

There are many exiting animations to choose from ([full list here](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/exitAnimations)).
For this excercise we choose [`ZoomOut`](https://docs.swmansion.com/react-native-reanimated/docs/api/LayoutAnimations/exitAnimations#zoom) animation.
After importing it from `react-native-reanimated` package, the only thing left is to assign it to the component using `exiting` property:

```js
<AnimatedIcon
  key={selected ? 1 : 0}
  name="favorite"
  size={50}
  color={selected ? '#ffaaa8' : '#aaa'}
  entering={BounceIn}
  exiting={ZoomOut}
/>
```

</details></br>
<details>
<summary><b>[BONUS 1]</b> Play with other built-in enter/exit animations</summary>

Be creative, there is no hint here for you.

</details></br>
<details>
<summary><b>[BONUS 2]</b> Try out using <code>Keyframe</code> animation to build wobble effect</summary>

Try replicating `BounceIn` effect with [`Keyframe` API](https://docs.swmansion.com/react-native-reanimated/docs/2.3.x/api/LayoutAnimations/keyframeAnimations). For example:

```js
const BetterBounce = new Keyframe({
  0: { transform: [{ scale: 1 }] },
  45: { transform: [{ scale: 2 }] },
  100: { transform: [{ scale: 1 }] },
});
```

</details></br>

## Step 7 – Simple physics

<details>
<summary><b>[1]</b> Create a timeline shared value (use <code>withTiming</code> to launch timing animation when the component mounts + adjust timing props such that the variable changes in the same pace with the time)</summary>

First, we create the aforementioned shared value, and intiate it to start at 0:

```js
function FlyingHeart() {
  const time = useSharedValue(0);
}
```

Then, we use `useEffect` to make the animation start for the animation once the component is mounted. We only need to run this effect once. We use linear easing such that the shared values changes in sync with the time (e.g. after 10 seconds the value increases by 10000ms).

```js
const duration = 30; // in seconds
useEffect(() => {
  time.value = withTiming(duration * 1000, {
    duration: duration * 1000,
    easing: Easing.linear,
  });
}, []);
```

</details></br>
<details>
<summary><b>[2]</b> Use timeline value to simulate projectile motion of the icon with gravity and predefined initial velocity

Use constant velocity motion along horizontal axis, below formula shows horizontal position as a function of time (`vx` is the velocity along x axis):

```
x = vx * t
```

For vertical axis we simulate motion with constant acceleration (gravity). Below formula shows vertical position as a function of time (`vy` is the initial velocity along y axis and `g` is the gravity acceleration):

```
y = vy * t + (-g * t * t) / 2;
```

</summary>

In this step we need to map the motion equation onto the icon transform props. To do that we need to define an animated style that applies the above eqnations. We also provide some sensible defaults for the velocity and gravity, but please feel free to play with adjusting those.

```js
const styles = useAnimatedStyle(() => {
  const t = time.value / 1000;
  const x = vx * t;
  const y = vy * t + (-g * t * t) / 2;
  return {
    transform: [{ translateX: x }, { translateY: -y }],
  };
});
```

Note that we use minus sign for `y` transform as the Y axis on the phone points downwards while in our equations assumed it pointing upwards.

Remember to pass the created styles to the icon component:

```js
return (
  <AnimatedIcon name="favorite" size={50} color={'#ffaaa8'} style={styles} />
);
```

In addition to adjusting velocity or gravity parameters, you can also speed up the animation altogether. This can be done by changing the timing attributes to run the same 30 seconds of animation but in shorter time by setting shorter duration (e.g. 10 times shorter):

```js
withTiming(duration * 1000, {
  duration: (duration * 1000) / 10,
  easing: Easing.linear,
});
```

</details></br>

## Step 8 – Explosion effect

<details>
<summary><b>[1]</b> Use the animated version of the icon and create explosion effect that is triggered when user selects the icon (mount multiple instances of the animated icon with randomized velocity)</summary>

We start off by creating a helper method for generating random starting values – we also define some sensible range for minimum and maximum values.

```js
const VX_MAX = 35; // vx will be between -35 and 35
const VY_MAX = 80; // vy will be between 0 and 70 (we only throw upwards)

function randomSpeed() {
  return {
    vx: Math.random() * 2 * VX_MAX - VX_MAX,
    vy: Math.random() * VY_MAX,
  };
}
```

Now, we can use `useRef` from React in order to generate a single configuration of randomized values per component instance and replace previously defined constant `vx` and `vy` values:

```js
const { vx, vy } = useRef(randomSpeed()).current;
```

Let's now create a component that renders some number of "flying" components that are going to animate:

```js
function ExplodingHearts({ count = 20 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        return <FlyingHeart key={index} />;
      })}
    </>
  );
}
```

Since the container now renders multiple `FlyingHeart` instances, we need to make sure these are positioned absolutely such that they start animating from the same space.
To do that, we update the render method to add `position` attribute to the icon component style:

```js
return (
  <AnimatedIcon
    name="favorite"
    size={50}
    color={'#ffaaa8'}
    style={[{ position: 'absolute' }, styles]}
  />
);
```

Finally, render `ExplodingHearts` in the main component for selected state only. This way we will see an explosion of hearts when turning from non-selected to selected:

```js
function Heart() {
  const [selected, setSelected] = useState(false);

  return (
    <>
      <Pressable onPress={() => setSelected(!selected)}>
        <AnimatedIcon
          key={selected ? 1 : 0}
          name="favorite"
          size={50}
          color={selected ? '#ffaaa8' : '#aaa'}
          exiting={ZoomOut}
          entering={BounceIn}
        />
      </Pressable>
      {selected && <ExplodingHearts />}
    </>
  );
}
```

</details></br>

## Break

## Step 9 - Building a toolbar

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

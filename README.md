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
    transform: [{scale: scale.value}],
  };
});
```

Use "Animated" version of the `View` component and pass animated style object to it:

```js
return (
  <Animated.View
    style={[{width: 50, height: 50, backgroundColor: '#001a72'}, styles]}
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
      style={[{width: 50, height: 50, backgroundColor: '#001a72'}, styles]}
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
import {withTiming, Easing, withSpring} from 'react-native-reanimated';
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
scale.value = withSpring(scale.value + 0.5, {damping: 3});
```

</details><br/>

<details>
<summary><b>[3]</b> Use “sequence” API to make the scale return to the initial</summary>
</details><br/>

<details>
<summary><b>[4]</b> Add log statements in render method and in useAnimatedStyle to when each of the method gets called</summary>
</details><br/>

<details>
<summary><b>[5]</b> Click the button fast to see how “cancellation” is handled (consider extending the animation duration to see it more clearly)</summary>
</details><br/>

## Step 3 – Animating third-party components

<details>
<summary><b>[1]</b>  Use <code>react-native-vector-icon</code> package to replace <code>View</code> with Icon (e.g. use “favorite” icon from <code>MaterialIcons</code> package)</summary>
</details><br/>

<details>
<summary><b>[2]</b>  Use <code>createAnimatedComponent</code> to get “Animated” version of <code>Icon</code> component</summary>
</details><br/>

<details>
<summary><b>[3]</b> Use <code>useAnimatedProps</code> to animate icon’s color in addition to the scale</summary>
</details><br/>

## Step 4 – Dealing with component state

<details>
<summary><b>[1]</b> Introduce a binary state to your component (with useState from react) and make the button flip between the state</summary>
</details><br/>

<details>
<summary><b>[2]</b> Now use state’s variable inside useAnimatedProps section to animate the color</summary>
</details><br/>

<details>
<summary><b>[3]</b> Use withTiming et al. inside useAnimatedProps to have one source of state</summary>
</details><br/>

<details>
<summary><b>[4]</b> Try tapping button fast to see how “cancellation” is handled</summary>
</details><br/>

## Step 5 – Building on-click effects

<details>
<summary><b>[1]</b> Make the icon flip between states with alternating and animated colors</summary>
</details></br>
<details>
<summary><b>[2]</b> Use scale animation to add “bounce on tap” reaction</summary>
</details></br>

<details>
<summary><b>[BONUS 1]</b> Change bounce effect to wobble effect using rotation transform</summary>
</details></br>

## Step 6 – Layout Animations API

<details>
<summary><b>[1]</b> Use entering animation (e.g. <code>BounceIn</code>) along with “key” property to trigger enter animation on state change and replicate the previous effect</summary>
</details></br>
<details>
<summary><b>[2]</b> Use exiting animation to keep previous state on screen as the new state animates in</summary>
</details></br>
<details>
<summary><b>[BONUS 1]</b> Play with other built-in enter/exit animations</summary>
</details></br>
<details>
<summary><b>[BONUS 2]</b> Try out using <code>Keyframe</code> animation to build wobble effect</summary>
</details></br>

## Step 7 – Simple physics

<details>
<summary><b>[1]</b> Create a timeline shared value (use withTiming to launch timing animation when the component mounts + adjust timing props such that the variable changes in the same pace with the time)</summary>
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
Hello
</details></br>

## Step 8 – Explosion effect

Use the animated version of the icon and create explosion effect that is triggered when user selects the icon (mount multiple instances of the animated icon with randomized velocity)

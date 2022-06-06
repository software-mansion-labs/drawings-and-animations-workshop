# Skia Logo

Draw and animate the Skia logo.

## Step 1 - Scale the path

Draw and scale the path.
The path can be scaled using the [Fitbox component](https://shopify.github.io/react-native-skia/docs/group/#fitbox).
The source and destination rectangle are available via the starting file.


## Step 2 - Add a linear Gradient

You can add [a linear gradient](https://shopify.github.io/react-native-skia/docs/shaders/gradients/#linear-gradient) to the path.
We suggest the colors below.

```ts
const colors = ["#3FCEBC", "#3CBCEB", "#5F96E7", "#816FE3", "#9F5EE2", "#DE589F", "#FF645E", "#FDA859", "#FAEC54", "#9EE671", "#41E08D"];
```

## Step 3 - Animate the path

We can create an animation value to animated the stroke of the path.

```tsx
const progress = useTiming(
  { to: 1, loop: true },
  { duration: 3000, easing: Easing.bezier(0.65, 0, 0.35, 1) }
);
```

The stroke can be updated via the `start` and `end` property.
In the example below we trim the path 25% at the beginning and 25% at the end.

```jsx
<Path path={path} start={0.25} end={0.25} style="stroke" strokeWidth={10} />
```

## Bonus

You can draw the gradient along the path.
To do so, you can use the `adaptive-bezier-curve` module to transform your path into a series of lines.
In the example below we convert the path into a series of command and convert bezier curves into lines.

```tsx
import bezier from "adaptive-bezier-curve";

const points = path
  .toCmds()
  .map(([verb, sx, sy, c1x, c1y, c2X, c2Y, ex, ey]) => {
    if (verb === PathVerb.Cubic) {
      return bezier([sx, sy], [c1x, c1y], [c2X, c2Y], [ex, ey]);
    }
    return null;
  })
  .flat();
```
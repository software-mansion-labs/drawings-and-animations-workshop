# Drawings

Draw with your finger

## Step 1 - Add a touch handler

Add [a touch handler](https://shopify.github.io/react-native-skia/docs/animations/touch-events).
Everytime the touch is active we draw a line to the current point.

## Step 2 - Handle the start of the touch

When the gesture starts, we move to the position of the point to close the previously drawn shape

## Step 3 - Draw smooth lines

Instead of drawing a straight line, we can use a simple formula to smooth a curve between two points.
The last point is available `path.current.getLastPoint()`.

```tsx
const xMid = (lastPt.x + x) / 2;
const yMid = (lastPt.y + y) / 2;
path.current.quadTo(lastPt.x, lastPt.y, xMid, yMid);
```
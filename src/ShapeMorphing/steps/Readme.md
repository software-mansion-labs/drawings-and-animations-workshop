# Feedback Slider

## Add a touch handler

Add a touch handler to move the slider around.
We need to create an offset value to remember where we were when the gesture started.
We also need to clamp the value between `start` and `end`.

## Interpolate paths

In the `Eye` and `Mouth` component, we can use the `progress` property to interpolate the path.
There are always three paths: `angryPath`, `normalPath`, and `goodPath`.

Two paths can be interpolated with each other using `path.interpolate()`.
Two or more paths can be interpolated using `interpolatePaths`
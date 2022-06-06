# Pinch to Zoom

Connect the `scale` shared value from Reanimated to Skia.
This can be done via [useSharedValueEffect hook](https://shopify.github.io/react-native-skia/docs/animations/reanimated/).

We will create a `transform` Skia value via `useValue()` and assign a new transform everytime `scale` is updated.
Finally we will bind the `transform` Skia value to a group.
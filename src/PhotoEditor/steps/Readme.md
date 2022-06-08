# Apply a photo filter

## Get Color matrices

Add a color matrix to an image.

You can get SVG color matrices [here](https://kazzkiq.github.io/svg-color-filter/).
In Skia, we need to convert these from SVG strings to arrays of numbers.
The order is the same.
React Native Skia has a [ColorMatrix component](https://shopify.github.io/react-native-skia/docs/color-filters/#color-matrix) you can use for that.

Finally, pick the four color matrices you would like to use in the demo in `Filters.tsx`. The variable names are `f1`, `f2`, `f3`, and `f4`.

## Select the color matrice

Create a matrix Skia value that will hold the current color matrix.
In `Filter.tsx`, there is a `selectFilter` function which given a point, will select the correct color matrix.

Add a touch handler to select the filter when the touch ends.

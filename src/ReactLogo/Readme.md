# React Logo

Build the react logo.
The center of the logo, radius of the middle circle, and bounding rectangle of the ellipsis is provided in `ReactLogo.tsx`.

## Step 1 - Draw the circle and the ellipisis

<details>
<summary>Using the Circle and Oval component.</summary>

```jsx
<Circle c={center} color={c1} r={r} />
<Oval rect={rct} color={c1} style="stroke" strokeWidth={strokeWidth} />
```
</details>

## Step 2 - Finish the logo

Draw two more identical ellipisis.
Rotate one to `60deg` (`PI/3`) and one to `-60deg` (`-PI/3`).
The Transform API is identical to the one in React Native expect for one crucial difference:
the default origin in Skia is the top left corner of the object.
So we will need to specify our origin of transformation to be in the center.

<details>
<summary>Using the Group component for the transformation
</summary>

```jsx
<Group transform={[{ rotate: -Math.PI / 3 }]} origin={center}>
  <Oval rect={rct} color={c1} style="stroke" strokeWidth={strokeWidth} />
</Group>
```
</details>

## Step 3 - Add Gradients

We can add some gradients.
For the circle a linear or a radial gradient should do ([see gradient documentation](https://shopify.github.io/react-native-skia/docs/shaders/gradients)).
The colors are provided in the starting file.
For the ellipsis, a linear gradient could work. 
A sweep gradient might also work wonderfully.


<details>
<summary>Applying a Sweep gradient to a group 
</summary>

```jsx
 <Group>
   <SweepGradient c={center} colors={[c1, c2, c1]} />
   <Oval rect={rct} style="stroke" strokeWidth={strokeWidth} />
 </Group>
```
</details>


## Step 4 - Blur Mask

We can make our logo even more fancy by adding a [blur mask effect](https://shopify.github.io/react-native-skia/docs/mask-filters/).
And we can flip some of the ellipsis to alternate colors.

<details>
<summary>Flip an elipsis horizontally</summary>

```jsx
<Group transform={[{ scaleX: -1 }]} origin={center}>
  <Oval rect={rct} style="stroke" strokeWidth={strokeWidth} />
</Group>
```
</details>


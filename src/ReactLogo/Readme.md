# React Logo

Build the react logo.
The center of the logo, radius of the middle circle, and bounding rectangle of the ellipsis is provided in `ReactLogo.tsx`.

## Step 1 

<details>
<summary><b>[1]</b> Draw the circle and the ellipisis.</summary>

```tsx
<Circle c={center} color={c1} r={r} />
<Oval rect={rct} color={c1} style="stroke" strokeWidth={strokeWidth} />
```
</details>

## Step 2

<details>
<summary><b>[2]</b> Draw two more identical ellipisis.
Rotate one to `60deg` (`PI/3`) and one to `-60deg` (`-PI/3`).
The Transform API is identical to the one in React Native expect for one crucial difference:
the default origin in Skia is the top left corner of the object.
So we will need to specify our origin of transformation to be in the center.
</summary>

```tsx
<Group transform={[{ rotate: -Math.PI / 3 }]} origin={center}>
  <Oval rect={rct} color={c1} style="stroke" strokeWidth={strokeWidth} />
</Group>
<Group transform={[{ rotate: Math.PI / 3 }]} origin={center}>
  <Oval rect={rct} color={c1} style="stroke" strokeWidth={strokeWidth} />
</Group>
```
</details>


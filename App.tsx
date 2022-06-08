import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { Routes } from "./src/Routes";
import { Examples } from "./src/Examples";
import { AnimatedReactions } from "./src/AnimatedReactions";
import { GestureBasedPicker } from "./src/GestureBasedPicker";
import { ReactLogo } from "./src/ReactLogo";
import { SkiaLogo } from "./src/SkiaLogo/SkiaLogo";
import { ShapeMorphing } from "./src/ShapeMorphing";
import { PinchToZoom } from "./src/PinchToZoom";
import { Drawings } from "./src/Drawings";
import { PhotoEditor } from "./src/PhotoEditor";
import { LoadAssets } from "./src/components/LoadAssets";
import { Stickers } from "./src/Stickers";
import { AllTheGestures } from "./src/AllTheGestures";

const Stack = createNativeStackNavigator<Routes>();
const assets: number[] = [];

function App() {
  return (
    <LoadAssets assets={assets}>
      <Stack.Navigator>
        <Stack.Screen name="Examples" component={Examples} />
        <Stack.Screen name="AnimatedReactions" component={AnimatedReactions} />
        <Stack.Screen
          name="GestureBasedPicker"
          component={GestureBasedPicker}
        />
        <Stack.Screen name="AllTheGestures" component={AllTheGestures} />
        <Stack.Screen name="SkiaLogo" component={SkiaLogo} />
        <Stack.Screen name="ReactLogo" component={ReactLogo} />
        <Stack.Screen name="ShapeMorphing" component={ShapeMorphing} />
        <Stack.Screen
          name="PinchToZoom"
          component={PinchToZoom}
          options={{ header: () => null }}
        />
        <Stack.Screen name="Drawings" component={Drawings} />
        <Stack.Screen name="PhotoEditor" component={PhotoEditor} />
        <Stack.Screen name="Stickers" component={Stickers} />
      </Stack.Navigator>
    </LoadAssets>
  );
}

// eslint-disable-next-line import/no-default-export
export default App;

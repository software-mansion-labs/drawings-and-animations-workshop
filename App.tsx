import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { Routes } from "./src/Routes";
import { Examples } from "./src/Examples";
import { ReactLogo } from "./src/ReactLogo";
import { SkiaLogo } from "./src/SkiaLogo/SkiaLogo";
import { ShapeMorphing } from "./src/ShapeMorphing";
import { PinchToZoom, assets } from "./src/PinchToZoom";
import { Drawings } from "./src/Drawings";
import { LoadAssets } from "./src/components/LoadAssets";

const Stack = createNativeStackNavigator<Routes>();

function App() {
  return (
    <LoadAssets assets={assets}>
      <Stack.Navigator>
        <Stack.Screen name="Examples" component={Examples} />
        <Stack.Screen name="SkiaLogo" component={SkiaLogo} />
        <Stack.Screen name="ReactLogo" component={ReactLogo} />
        <Stack.Screen name="ShapeMorphing" component={ShapeMorphing} />
        <Stack.Screen
          name="PinchToZoom"
          component={PinchToZoom}
          options={{ header: () => null }}
        />
        <Stack.Screen name="Drawings" component={Drawings} />
      </Stack.Navigator>
    </LoadAssets>
  );
}

// eslint-disable-next-line import/no-default-export
export default App;

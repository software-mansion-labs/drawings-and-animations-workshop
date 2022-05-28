import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { Routes } from "./src/Routes";
import { Examples } from "./src/Examples";
import { ReactLogo } from "./src/ReactLogo";
import { SkiaLogo } from "./src/SkiaLogo/SkiaLogo";
import { ShapeMorphing } from "./src/ShapeMorphing";

const Stack = createNativeStackNavigator<Routes>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Examples" component={Examples} />
        <Stack.Screen name="SkiaLogo" component={SkiaLogo} />
        <Stack.Screen name="ReactLogo" component={ReactLogo} />
        <Stack.Screen name="ShapeMorphing" component={ShapeMorphing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// eslint-disable-next-line import/no-default-export
export default App;

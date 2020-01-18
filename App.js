import React from 'react';
import Routes from "./src/pages/routes"

import {StatusBar, YellowBox} from "react-native"
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket"
])


export default function App() {
  return (
    <>
    <StatusBar barStyle = "light-content"/>
    <Routes/>
    </>
  );
}






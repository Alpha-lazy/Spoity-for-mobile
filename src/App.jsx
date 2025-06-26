import { useState } from "react";
import { isMobile } from 'react-device-detect';
import "./App.css";
import { DataProvider } from "./Pages/DataContext";
import RouterContent from "./Pages/RouterContent ";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import MobileWebPlayerRouter from "./Mobile assets/MobileWebPlayerRouter";

function App() {
  // const location = useLocation();
  console.log(isMobile);
  
  return (
    <DataProvider>
      <BrowserRouter>
      { isMobile?
        <MobileWebPlayerRouter/>
        :
        <RouterContent />

      }
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;

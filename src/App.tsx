import './App.css';
import { Loading } from "./pages/Loading.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login.tsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PrimarySearchAppBar from './components/Nav.tsx';
import { OLEDTheme } from './themes/OLED.ts';
import Collectionner from './pages/Collectionner.tsx';
import { BlueTheme } from './themes/blue.ts';
import { DarkTheme } from './themes/dark.ts';
import { SithTheme } from './themes/sith.ts';
import { RedTheme } from './themes/red.ts';
import { XMasTheme } from './themes/xmas.ts';
import { LightTheme } from './themes/light.ts';
import { JediTheme } from './themes/jedi.ts';
import { HalloweenTheme } from './themes/halloween.ts';
import { GreenTheme } from './themes/green.ts';
import Viewer from './pages/Viewer.tsx';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
function App() {
  const theme = localStorage.getItem("theme");
  const OLED = createTheme(OLEDTheme);
  const blueTheme = createTheme(BlueTheme);
  const darkTheme = createTheme(DarkTheme);
  const sithTheme = createTheme(SithTheme);
  const redTheme = createTheme(RedTheme);
  const xmasTheme = createTheme(XMasTheme);
  const lightTheme = createTheme(LightTheme);
  const jediTheme = createTheme(JediTheme);
  const halloween = createTheme(HalloweenTheme);
  const greenTheme = createTheme(GreenTheme);
  const themes: any = useMemo(() => (
    {
      OLED,
      blueTheme,
      darkTheme,
      sithTheme,
      redTheme,
      xmasTheme,
      lightTheme,
      jediTheme,
      halloween,
      greenTheme
    }
  ), [OLED, blueTheme, darkTheme, sithTheme, redTheme, xmasTheme, lightTheme, jediTheme, halloween, greenTheme]);
  const [themeState, setThemeState] = React.useState(themes[theme || "darkTheme"]);
  useLayoutEffect(() => {
    const handleLocalStorageChange = (e) => {
      const theme = localStorage.getItem("theme");
      if (!theme) {
        return;
      }
      setThemeState(themes[theme]);
    };
    window.addEventListener('storage', handleLocalStorageChange);

    return () => {
      window.removeEventListener('storage', handleLocalStorageChange);
    };
  }, [themes]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (!theme) {
      return;
    }
    document.getElementsByTagName("body")[0].style.background = themeState.palette.background.default;
  }, [themeState.palette.background.default]);

  return (
    <>
      <ThemeProvider theme={themeState}>
        <CssBaseline />
        <PrimarySearchAppBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/login" element={<Login />} />
            <Route path="/collectionner" element={<Collectionner />} />
            <Route path="/viewer" element={<Viewer />} />
            <Route path="*" element={<Loading />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

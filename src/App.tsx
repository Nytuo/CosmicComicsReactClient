import './App.css';
import { Loading } from "./pages/Loading.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login.tsx';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import PrimarySearchAppBar from './components/Nav.tsx';
import { OLEDTheme } from './themes/OLED.ts';
function App() {
  const OLED = createTheme(OLEDTheme);
  return (
    <>
      <ThemeProvider theme={OLED}>
        <CssBaseline />
        <PrimarySearchAppBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import Products from "../src/pages/Products";
import Product from "../src/pages/Product";
import Sale from "../src/pages/Sale";
import AuthState from "./context/auth/authState";
import DataState from "./context/ventoData/dataState";
import { createTheme } from '../src/themes';
import { CssBaseline } from '@mui/material';
import { persistor, store } from './config/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from '../src/components/toaster';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

function App() {
  const theme = createTheme();
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthState>
            <DataState>
              <Router>
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/products" element={<Products />} />
                    <Route exact path="/product" element={<Product />} />
                    <Route exact path="/sale" element={<Sale />} />
                </Routes>
              </Router>
            </DataState>
          </AuthState>
          <Toaster />
        </ThemeProvider>
      </PersistGate>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;

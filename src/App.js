import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";
import MercadoPago from "../src/pages/MercadoPago";
import Products from "../src/pages/Products";
import Product from "../src/pages/Product";
import Sale from "../src/pages/Sale";
import Sales from "../src/pages/Sales";
import LandingPage from "../src/pages/LandingPage";
import Loggout from "../src/pages/Loggout";
import SignUp from "../src/pages/SignUp";
import AuthState from "./context/auth/authState";
//import DataState from "./context/ventoData/dataState";
import { createTheme } from '../src/themes';
import { CssBaseline } from '@mui/material';
import { persistor, store } from './config/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from '../src/components/toaster';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { paths } from "./paths";

function App() {
  const theme = createTheme();
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthState>
            {/* <DataState> */}
              <Router>
                <Routes>
                    <Route exact path={paths.login} element={<Login />} />
                    <Route exact path={paths.home} element={<Home />} />
                    <Route exact path={paths.products} element={<Products />} />
                    <Route exact path={paths.product} element={<Product />} />
                    <Route exact path={paths.product} element={<MercadoPago />} />
                    <Route exact path={paths.sales} element={<Sales />} />
                    <Route exact path={paths.sale} element={<Sale />} />
                    <Route exact path={paths.index} element={<LandingPage />} />
                    <Route exact path={paths.signup} element={<SignUp />} />
                    <Route exact path={paths.loggout} element={<Loggout />} />
                </Routes>
              </Router>
            {/* </DataState> */}
          </AuthState>
          <Toaster />
        </ThemeProvider>
      </PersistGate>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;

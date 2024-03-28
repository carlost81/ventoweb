import React, {useContext} from 'react';
import  AuthContext from "../context/auth/authContext";
import { DashboardLayout } from '../components/dashboard-layout';
import { paths } from '../paths';
import { getDataInitialState } from '../actions'
import { useNavigate } from 'react-router-dom'


const Loggout = () => {
  const navigate = useNavigate();
  const {  signOut, getAuthInitialState } = useContext(AuthContext);
  signOut();
  localStorage.clear()
  getAuthInitialState()
  getDataInitialState()
  navigate(paths.index)
}

Loggout.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Loggout
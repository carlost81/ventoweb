import React, { useState, useEffect, useContext,useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { paths } from '../paths';
import { useNavigate } from "react-router-dom";
import  AuthContext from "../context/auth/authContext";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.ventopro.com/">
        Vento
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();


// ValidatedTextField.js
const ValidatedTextField = ({ label,name, id,type,validator, onChange }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleChange = e => {
    const newValue = e.target.value;
    const errorMessage = validator(newValue);
    setValue(newValue);
    setError(errorMessage);
    onChange(!errorMessage);
  };
  return (
    <TextField
      name={name}
      id={id}
      type={type}
      required
      fullWidth
      label={label}
      value={value}
      onChange={handleChange}
      error={!!error}
      helperText={error}
    />
  );
};
// validators.js
const nameValidator = value => {
  if (value.length < 3) return "Debe tener al menos 3 caracteres";
  if (value.length > 50) return "Debe tener menos de 50 caracteres";
  if (!/^[a-zA-Z0-9 ]+$/.test(value))
    return "Solo puede ingresar letras, espacios y numeros";
  return false;
};
const emailValidator = value => {
  if (!/^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(value))
    return "email invalido";
  return false;
};
const numberValidator = value => {
  if (!/^[1-9][0-9]*$/.test(value))
    return "numero invalido";
  return false;
};
const passwordValidator = value => {
  if (value.length < 6) return "password invalido, Debe tener al menos 6 caracteres";
  return false;
};


export default function SignUp() {

  let navigate = useNavigate();
  const formValid = useRef({ name: false, email: false, company: false, phone: false, password: false });
  const [open, setOpen] = React.useState(false);
  const [messageError, setMessageError] = React.useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    console.log('valid form:',formValid.current,Object.values(formValid.current).every(isValid => isValid))
    if (Object.values(formValid.current).every(isValid => isValid)) {
      const dataForm = new FormData(e.currentTarget);
      const config = JSON.parse(localStorage.getItem('config'));
      const data = ({
        company: dataForm.get('company'),
        phone: dataForm.get('phone'),
        name: dataForm.get('name'),
        email: dataForm.get('email'),
        password: dataForm.get('password'),
      });
      console.log(data, config);
      signUp(data,config).then((result) => {
        console.log('result:', result.success, result.message,result.user)
        if(result.success){
          localStorage.setItem('user',JSON.stringify(result.user));
          localStorage.setItem('company',JSON.stringify(result.company));
          navigate('/home')
        }else{
          setOpen(true);
          setMessageError('Error: '+result.message)
        }
      })
      //alert("Form is valid! Submitting the form...", data.get('name'));
    } else {
      setOpen(true);
      setMessageError('Diligencie correctamente todos los campos')
      //alert("Form is invalid! Please check the fields...");
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const {  getConfig, signUp, message } = useContext(AuthContext);


  /*const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const config = JSON.parse(localStorage.getItem('config'));
    const user = ({
      company: data.get('company'),
      phone: data.get('phone'),
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });
    signUp(user,config).then((result) => {
      console.log('result:', result)
    })
  };*/

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('config'))){
      getConfig().then((config) => {
        console.log('empty config',config)
        localStorage.setItem('config',JSON.stringify(config));
      });
    }
  }, []);


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'orange' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={handleClose}
            message={messageError}
          />
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} >
                <ValidatedTextField
                  autoComplete="given-name"
                  name="company"
                  fullWidth
                  id="company"
                  label="Empresa o negocio"
                  autoFocus
                  validator={nameValidator}
                  onChange={isValid => (formValid.current.company = isValid)}
                />
              </Grid>
              <Grid item xs={12} >
                <ValidatedTextField
                  name="name"
                  id="name"
                  label="Nombre usuario"
                  validator={nameValidator}
                  onChange={isValid => (formValid.current.name = isValid)}
                />
              </Grid>
              <Grid item xs={12} >
                <ValidatedTextField
                  fullWidth
                  id="phone"
                  label="Telefono"
                  name="phone"
                  validator={numberValidator}
                  onChange={isValid => (formValid.current.phone = isValid)}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  id="email"
                  label="Email"
                  name="email"
                  validator={emailValidator}
                  onChange={isValid => (formValid.current.email = isValid)}
                />
              </Grid>
              <Grid item xs={12}>
                <ValidatedTextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  //type="password"
                  id="password"
                  //autoComplete="new-password"
                  validator={passwordValidator}
                  onChange={isValid => (formValid.current.password = isValid)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href={paths.login} variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
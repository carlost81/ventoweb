import React, { useState, useEffect, useContext } from 'react';
import  AuthContext from "../context/auth/authContext";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import "../styles.css";
import { id } from 'date-fns/locale';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

function Login () {
  let navigate = useNavigate();
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const {  getConfig, signIn,getUser } = useContext(AuthContext);

  //const { email, password } = user;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setUser({ email: data.get('email'),password: data.get('password') });
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    console.log('user::',user)
    signIn({ email: data.get('email'),password: data.get('password') }).then((uid) => {
      if (uid) {
        getUser(uid).then((user) => {
          console.log('user.',user);
          localStorage.setItem('user',JSON.stringify(user));
          navigate('/home')
          console.log('uid',uid)
        });
      }
    });
  };

  console.log('hola')

  useEffect(() => {
    const config = JSON.parse(localStorage.getItem('config'))
    if (!config){
      getConfig().then((config) => {
        console.log(config)
        localStorage.setItem('config',JSON.stringify(config));
      });
    }
    const user = JSON.parse(localStorage.getItem('user'));
    if(user) navigate('/home')
  }, []);

  const onPressLogin = () => {
    var ok = true;
    console.log('onpress1',user)
      signIn(user).then((uid) => {
        if (uid) {
          navigate('/home')
          console.log('uid',uid)
        }
      });
  };

    return (
<ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
      );
}

export default Login
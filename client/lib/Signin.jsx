import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CardActions
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signin() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      email: values.email,
      password: values.password
    };

    axios.post('http://localhost:5000/api/auth/login', user)
      .then(response => {
        const { token, ...userData } = response.data;

        if (token) {
          localStorage.setItem('jwt', JSON.stringify(token));
          localStorage.setItem('user', JSON.stringify(userData));

          navigate('/');
        }
      })
      .catch(err => {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to sign in. Please check your credentials.';

        setValues({ ...values, error: errorMessage });
      });
  };

  return (
    <Card sx={{
      maxWidth: 500,
      margin: 'auto',
      mt: 8,
      p: 3,
      textAlign: 'center'
    }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Sign In
        </Typography>

        <TextField
          id="email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          fullWidth
          margin="normal"
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          fullWidth
          margin="normal"
        />

        {values.error && (
          <Typography color="error" component="p" sx={{ mt: 2 }}>
            {values.error}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{
        flexDirection: 'column',
        px: 3,
        pb: 3
      }}>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          sx={{ width: '100%', py: 1.5, mb: 2 }}
        >
          Sign In
        </Button>

        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#1976d2',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Sign Up
          </Link>
        </Typography>
      </CardActions>
    </Card>
  );
}

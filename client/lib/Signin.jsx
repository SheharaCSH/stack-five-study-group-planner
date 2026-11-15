import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
      email: values.email || undefined,
      password: values.password || undefined
    };

    axios.post('http://localhost:5000/api/auth/login', user)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('jwt', JSON.stringify(response.data.token));
          localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/');
        }
      })
      .catch(err => {
        const errorMessage = err.response?.data?.message || 'Failed to sign in. Please check your credentials.';
        setValues({ ...values, error: errorMessage });
      });
  };

  return (
    <Card sx={{ maxWidth: 500, margin: 'auto', mt: 8, p: 3, textAlign: 'center' }}>
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

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button color="primary" variant="contained" onClick={clickSubmit} sx={{ width: '100%', py: 1.5 }}>
          Sign In
        </Button>
      </CardActions>
    </Card>
  );
}
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    open: false,
    error: ''
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = () => {
    const user = {
      name: values.name,
      email: values.email,
      password: values.password
    };

    axios.post('http://localhost:5000/api/auth/register', user)
      .then(response => {
        setValues({ ...values, error: '', open: true });
      })
      .catch(err => {
        const errorMessage =
          err.response?.data?.message ||
          'Failed to sign up. Please check your inputs.';

        setValues({ ...values, error: errorMessage });
      });
  };

  return (
    <div>
      <Card sx={{
        maxWidth: 500,
        margin: 'auto',
        mt: 8,
        p: 3,
        textAlign: 'center'
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Sign Up
          </Typography>

          <TextField
            id="name"
            label="Full Name"
            value={values.name}
            onChange={handleChange('name')}
            fullWidth
            margin="normal"
          />

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
          pb: 2,
          px: 2
        }}>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            sx={{ width: '100%', py: 1.5, mb: 2 }}
          >
            Sign Up
          </Button>

          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              to="/signin"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </CardActions>
      </Card>

      <Dialog
        open={values.open}
        onClose={() => navigate('/signin')}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          New Account
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1">
            New account successfully created. You can now sign in with your credentials.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate('/signin')}
            autoFocus
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

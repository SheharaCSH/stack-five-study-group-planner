import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the currently authenticated user's profile
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      navigate('/signin');
      return;
    }

    let token;

    try {
      token = JSON.parse(jwt);
    } catch (error) {
      token = jwt;
    }

    axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('jwt');
          localStorage.removeItem('user');
          navigate('/signin');
        } else {
          setError('Failed to load user profile.');
          setLoading(false);
        }
      });
  }, [navigate]);

  return (
    <Card sx={{
      maxWidth: 600,
      margin: 'auto',
      mt: 8,
      p: 3,
      boxShadow: 3
    }}>
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Profile & Account Management
        </Typography>

        {loading && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <CircularProgress />
          </div>
        )}

        {error && (
          <Typography
            color="error"
            sx={{ mb: 2, textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}

        {user && (
          <List dense>
            <ListItem>
              <ListItemText
                primary="Full Name"
                secondary={user.name || 'N/A'}
              />
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Email Address"
                secondary={user.email || 'N/A'}
              />
            </ListItem>

            <Divider />

            <ListItem>
              <ListItemText
                primary="Joined Date"
                secondary={
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : 'N/A'
                }
              />
            </ListItem>
          </List>
        )}

        {!loading && !error && user && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, textAlign: 'center' }}
          >
            Profile information is displayed here.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

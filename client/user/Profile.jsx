import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, List, ListItem, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [error, setError] = useState('');

  // Fetch user profile data when component mounts or userId changes
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const token = jwt ? JSON.parse(jwt) : '';

    axios.get(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setRedirectToSignin(true);
        } else {
          setError('Failed to load user profile.');
        }
      });
  }, [userId]);

  // Redirect to signin if not authenticated
  if (redirectToSignin) {
    navigate('/signin');
    return null;
  }

  // Handle account deletion request
  const deleteAccount = () => {
    const jwt = localStorage.getItem('jwt');
    const token = jwt ? JSON.parse(jwt) : '';

    axios.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        navigate('/');
      })
      .catch(err => {
        setError('Failed to delete account. Please try again.');
        setOpenDeleteDialog(false);
      });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 8, p: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
          Profile & Account Management
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <List dense>
          <ListItem>
            <ListItemText primary="Full Name" secondary={user.name || 'Loading...'} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Email Address" secondary={user.email || 'Loading...'} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText 
              primary="Joined Date" 
              secondary={user.created ? new Date(user.created).toLocaleDateString() : 'N/A'} 
            />
          </ListItem>
        </List>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => navigate(`/user/edit/${userId}`)}
          >
            Edit Profile
          </Button>

          <Button 
            variant="contained" 
            color="error" 
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="error" variant="contained" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
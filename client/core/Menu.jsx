import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the user is currently authenticated by looking for the JWT token
  const isAuthenticated = () => {
    return localStorage.getItem('jwt') !== null;
  };

  // Retrieve user ID from localStorage to direct to the correct profile page
  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        return parsedUser._id || parsedUser.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Handle user sign out by clearing localStorage and navigating to home
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Helper function to highlight the active menu link
  const isActive = (path) => {
    return location.pathname === path ? { color: '#ff4081', fontWeight: 'bold' } : { color: '#ffffff' };
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App Title / Brand */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Study Group Planner
        </Typography>

        {/* Home Button */}
        <Button color="inherit" style={isActive('/')} onClick={() => navigate('/')}>
          Home
        </Button>

        {/* My Page Button (Visible only when authenticated) */}
        {isAuthenticated() && (
          <Button 
            color="inherit" 
            style={isActive(`/user/${getUserId()}`)} 
            onClick={() => {
              const userId = getUserId();
              if (userId) {
                navigate(`/user/${userId}`);
              }
            }}
          >
            My Page
          </Button>
        )}

        {/* Conditional Sign In / Sign Out Buttons */}
        {!isAuthenticated() ? (
          <Button color="inherit" style={isActive('/signin')} onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        ) : (
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const getUser = () => {
    const user = localStorage.getItem('user');

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      return null;
    }
  };

  const user = getUser();
  const token = localStorage.getItem('jwt');
  const userId = user?._id || user?.id;
  const authenticated = Boolean(token && userId);

  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path
      ? { color: '#ff4081', fontWeight: 'bold' }
      : { color: '#ffffff' };
  };

  const handleMyPage = () => {
    if (authenticated) {
      navigate(`/user/${userId}`);
    } else {
      navigate('/signin');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Study Group Planner
        </Typography>

        <Button
          color="inherit"
          style={isActive('/')}
          onClick={() => navigate('/')}
        >
          Home
        </Button>

        <Button
          color="inherit"
          style={isActive(`/user/${userId}`)}
          onClick={handleMyPage}
        >
          My Page
        </Button>

        {!authenticated ? (
          <Button
            color="inherit"
            style={isActive('/signin')}
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
        ) : (
          <Button
            color="inherit"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

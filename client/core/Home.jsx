import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Container } from '@mui/material';
import axios from 'axios';

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  // Fetch all study groups from the backend API when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/groups')
      .then(response => {
        setGroups(response.data);
      })
      .catch(err => {
        console.error('Error fetching study groups:', err);
        setError('Failed to load study groups. Please check if the server is running.');
      });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Study Groups Dashboard
        </Typography>
      </Box>

      {/* Display error message if API call fails */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Grid layout for displaying study group cards */}
      <Grid container spacing={3}>
        {groups.length > 0 ? (
          groups.map(group => (
            <Grid item xs={12} sm={6} md={4} key={group._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {group.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Course: {group.course || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {group.description || 'No description provided.'}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Location: {group.location || 'Online / TBD'}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Meeting Time: {group.meetingTime || 'TBD'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              No study groups available at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
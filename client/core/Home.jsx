import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  const [values, setValues] = useState({
    name: '',
    course: '',
    description: '',
    location: '',
    meetingTime: '',
    maxMembers: '10'
  });

  // Get the current user's ID
  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  // Get an ID from a populated object or an ID string
  const getId = (value) => {
    if (!value) return null;
    return String(value._id || value.id || value);
  };

  // Check whether the current user created a group
  const isCreatedByMe = (group) => {
    return getId(group.createdBy) === String(currentUserId);
  };

  // Check whether the current user belongs to a group
  const isMyGroup = (group) => {
    const isCreator = isCreatedByMe(group);

    const isMember = group.members?.some(
      member => getId(member) === String(currentUserId)
    );

    return isCreator || isMember;
  };

  // Filter groups for My Groups tab
  const myGroups = groups.filter(isMyGroup);

  // Fetch all study groups
  const fetchGroups = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        'http://localhost:5000/api/groups'
      );

      setGroups(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load study groups. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Change tabs
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open the new group dialog
  const handleOpenDialog = () => {
    if (!localStorage.getItem('jwt')) {
      navigate('/signin');
      return;
    }

    setError('');
    setSuccess('');
    setOpenDialog(true);
  };

  // Close the new group dialog
  const handleCloseDialog = () => {
    if (creating) return;
    setOpenDialog(false);
  };

  // Create a new study group
  const handleCreateGroup = async (event) => {
    event.preventDefault();

    if (!values.name.trim() || !values.course.trim()) {
      setError('Group Name and Course are required.');
      return;
    }

    if (Number(values.maxMembers) < 1) {
      setError('Maximum Members must be at least 1.');
      return;
    }

    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      navigate('/signin');
      return;
    }

    let token;

    try {
      token = JSON.parse(jwt);
    } catch {
      token = jwt;
    }

    const newGroup = {
      name: values.name.trim(),
      course: values.course.trim(),
      description: values.description,
      location: values.location,
      maxMembers: Number(values.maxMembers)
    };

    if (values.meetingTime) {
      newGroup.meetingTime = new Date(
        values.meetingTime
      ).toISOString();
    }

    setCreating(true);
    setError('');

    try {
      await axios.post(
        'http://localhost:5000/api/groups',
        newGroup,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setValues({
        name: '',
        course: '',
        description: '',
        location: '',
        meetingTime: '',
        maxMembers: '10'
      });

      setOpenDialog(false);
      setSuccess('Study group created successfully!');

      await fetchGroups();

      // Show the newly created group in My Groups
      setTab(0);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        'Failed to create the study group.'
      );
    } finally {
      setCreating(false);
    }
  };

  // Render a study group card
  const renderGroupCard = (group) => (
    <Grid item xs={12} sm={6} md={4} key={group._id}>
      <Card sx={{
        height: '100%',
        boxShadow: 3
      }}>
        <CardContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1,
            mb: 1
          }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold' }}
            >
              {group.name}
            </Typography>

            {isCreatedByMe(group) && (
              <Chip
                label="Created by you"
                color="success"
                size="small"
              />
            )}
          </Box>

          <Typography color="text.secondary" gutterBottom>
            Course: {group.course || 'N/A'}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {group.description || 'No description provided.'}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Location: {group.location || 'Online / TBD'}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Meeting Time: {
              group.meetingTime
                ? new Date(group.meetingTime).toLocaleString()
                : 'TBD'
            }
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Maximum Members: {group.maxMembers || 10}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 'bold' }}
        >
          Study Group Planner
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Find and manage your study groups.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="My Groups" />
          <Tab label="View Groups" />
        </Tabs>
      </Box>

      {/* Messages */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 5
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* My Groups Tab */}
          {tab === 0 && (
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 'bold', mb: 3 }}
              >
                My Study Groups
              </Typography>

              {myGroups.length > 0 ? (
                <Grid container spacing={3}>
                  {myGroups.map(renderGroupCard)}
                </Grid>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 6 }}
                >
                  You haven't joined any study groups yet.
                </Typography>
              )}
            </Box>
          )}

          {/* View Groups Tab */}
          {tab === 1 && (
            <Box>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold' }}
                >
                  Available Study Groups
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleOpenDialog}
                >
                  New Group
                </Button>
              </Box>

              {groups.length > 0 ? (
                <Grid container spacing={3}>
                  {groups.map(renderGroupCard)}
                </Grid>
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 6 }}
                >
                  No study groups available yet.
                </Typography>
              )}
            </Box>
          )}
        </>
      )}

      {/* New Group Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleCreateGroup}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            Create a New Study Group
          </DialogTitle>

          <DialogContent>
            <TextField
              name="name"
              label="Group Name"
              value={values.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              name="course"
              label="Course"
              value={values.course}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            <TextField
              name="description"
              label="Description"
              value={values.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />

            <TextField
              name="location"
              label="Location"
              value={values.location}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="meetingTime"
              label="Meeting Time"
              type="datetime-local"
              value={values.meetingTime}
              onChange={handleChange}
              fullWidth
              margin="normal"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              name="maxMembers"
              label="Maximum Members"
              type="number"
              value={values.maxMembers}
              onChange={handleChange}
              fullWidth
              margin="normal"
              slotProps={{
                htmlInput: { min: 1 }
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
              disabled={creating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

    </Container>
  );
}

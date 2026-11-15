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

const emptyValues = {
  name: '',
  course: '',
  description: '',
  location: '',
  meetingTime: '',
  maxMembers: '10'
};

export default function Home() {
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(emptyValues);

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getCurrentUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const getId = (value) => {
    if (!value) return null;
    return String(value._id || value.id || value);
  };

  const isCreatedByMe = (group) => {
    return getId(group.createdBy) === String(currentUserId);
  };

  const isMyGroup = (group) => {
    const isCreator = isCreatedByMe(group);
    const isMember = group.members?.some(
      member => getId(member) === String(currentUserId)
    );
    return isCreator || isMember;
  };

  const myGroups = groups.filter(isMyGroup);

  const getToken = () => {
    const storedJwt = localStorage.getItem('jwt');
    if (!storedJwt) return null;

    try {
      return JSON.parse(storedJwt);
    } catch {
      return storedJwt;
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:5000/api/groups');
      setGroups(response.data);

      // Keep the selected group's details in sync after an update.
      if (selectedGroup) {
        const updatedSelectedGroup = response.data.find(
          group => group._id === selectedGroup._id
        );
        setSelectedGroup(updatedSelectedGroup || null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load study groups. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // Initial list load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenCreateDialog = () => {
    if (!getToken()) {
      navigate('/signin');
      return;
    }

    setValues({ ...emptyValues });
    setFormMode('create');
    setError('');
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = () => {
    if (!selectedGroup) return;

    const meetingTime = selectedGroup.meetingTime
      ? (() => {
          const date = new Date(selectedGroup.meetingTime);
          const localDate = new Date(
            date.getTime() - date.getTimezoneOffset() * 60000
          );
          return localDate.toISOString().slice(0, 16);
        })()
      : '';

    setValues({
      name: selectedGroup.name || '',
      course: selectedGroup.course || '',
      description: selectedGroup.description || '',
      location: selectedGroup.location || '',
      meetingTime,
      maxMembers: String(selectedGroup.maxMembers || 10)
    });

    setFormMode('edit');
    setError('');
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    if (saving) return;
    setOpenFormDialog(false);
    setError('');
  };

  const handleSubmitGroup = async (event) => {
    event.preventDefault();

    if (!values.name.trim() || !values.course.trim()) {
      setError('Group Name and Course are required.');
      return;
    }

    if (!Number.isFinite(Number(values.maxMembers)) || Number(values.maxMembers) < 1) {
      setError('Maximum Members must be at least 1.');
      return;
    }

    const token = getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    const groupData = {
      name: values.name.trim(),
      course: values.course.trim(),
      description: values.description,
      location: values.location,
      maxMembers: Number(values.maxMembers)
    };

    if (values.meetingTime) {
      const parsedMeetingTime = new Date(values.meetingTime);
      if (Number.isNaN(parsedMeetingTime.getTime())) {
        setError('Please enter a valid meeting time.');
        return;
      }
      groupData.meetingTime = parsedMeetingTime.toISOString();
    }

    setSaving(true);
    setError('');

    try {
      if (formMode === 'edit') {
        await axios.put(
          `http://localhost:5000/api/groups/${selectedGroup._id}`,
          groupData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Study group updated successfully!');
      } else {
        await axios.post(
          'http://localhost:5000/api/groups',
          groupData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess('Study group created successfully!');
      }

      setOpenFormDialog(false);
      await fetchGroups();

      if (formMode === 'create') {
        setTab(0);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        `Failed to ${formMode === 'edit' ? 'update' : 'create'} the study group.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    const token = getToken();
    if (!token) {
      navigate('/signin');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${selectedGroup._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOpenDeleteConfirm(false);
      setSelectedGroup(null);
      setSuccess('Study group deleted successfully!');
      await fetchGroups();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        'Failed to delete the study group.'
      );
      setOpenDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const renderGroupCard = (group) => (
    <Grid item xs={12} sm={6} md={4} key={group._id}>
      <Card
        onClick={() => {
          setSelectedGroup(group);
          setError('');
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedGroup(group);
            setError('');
          }
        }}
        sx={{
          height: '100%',
          boxShadow: 3,
          cursor: 'pointer',
          transition: 'transform 0.15s, box-shadow 0.15s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: 6
          }
        }}
      >
        <CardContent>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 1,
            mb: 1
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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

          <Typography variant="body2" sx={{ mb: 1 }}>
            {group.description || 'No description provided.'}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Click to view details
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const renderFormFields = () => (
    <>
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
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {error && !openFormDialog && !openDeleteConfirm && (
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
                  onClick={handleOpenCreateDialog}
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

      {/* Group Details Dialog */}
      <Dialog
        open={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedGroup && (
          <>
            <DialogTitle sx={{ fontWeight: 'bold' }}>
              {selectedGroup.name}
            </DialogTitle>

            <DialogContent dividers>
              {isCreatedByMe(selectedGroup) && (
                <Chip
                  label="Created by you"
                  color="success"
                  size="small"
                  sx={{ mb: 2 }}
                />
              )}

              <Typography sx={{ mb: 1 }}>
                <strong>Course:</strong> {selectedGroup.course || 'N/A'}
              </Typography>

              <Typography sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                <strong>Description:</strong>{' '}
                {selectedGroup.description || 'No description provided.'}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Location:</strong>{' '}
                {selectedGroup.location || 'Online / TBD'}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Meeting Time:</strong>{' '}
                {selectedGroup.meetingTime
                  ? new Date(selectedGroup.meetingTime).toLocaleString()
                  : 'TBD'}
              </Typography>

              <Typography>
                <strong>Maximum Members:</strong>{' '}
                {selectedGroup.maxMembers || 10}
              </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelectedGroup(null)}
                color="inherit"
              >
                Close
              </Button>

              {isCreatedByMe(selectedGroup) && (
                <>
                  <Button
                    onClick={handleOpenEditDialog}
                    variant="outlined"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => setOpenDeleteConfirm(true)}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create / Edit Group Dialog */}
      <Dialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleSubmitGroup}>
          <DialogTitle sx={{ fontWeight: 'bold' }}>
            {formMode === 'edit'
              ? 'Edit Study Group'
              : 'Create a New Study Group'}
          </DialogTitle>

          <DialogContent>
            {renderFormFields()}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseFormDialog}
              color="inherit"
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={saving}
            >
              {saving
                ? (formMode === 'edit' ? 'Saving...' : 'Creating...')
                : (formMode === 'edit' ? 'Save Changes' : 'Create Group')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => {
          if (!deleting) setOpenDeleteConfirm(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Delete Study Group?
        </DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete
            {' '}<strong>{selectedGroup?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDeleteConfirm(false)}
            color="inherit"
            disabled={deleting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeleteGroup}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

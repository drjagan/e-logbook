import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getActivityById, deleteActivity } from '../store/slices/activitySlice';
import { MainLayout } from '../components/Layout/MainLayout';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedActivity: activity, loading, error } = useAppSelector(
    (state) => state.activities
  );

  useEffect(() => {
    if (id) {
      dispatch(getActivityById(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (id && window.confirm('Are you sure you want to delete this activity?')) {
      await dispatch(deleteActivity(id));
      navigate('/activities');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  if (!activity) {
    return (
      <MainLayout>
        <Alert severity="info">Activity not found</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/activities')}
            >
              Back to Activities
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4" gutterBottom>
                {activity.title}
              </Typography>
              <Box>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/activities/${id}/edit`)}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Activity Type
            </Typography>
            <Chip
              label={activity.type}
              color="primary"
              sx={{ mt: 1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Activity Date
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {format(new Date(activity.activityDate), 'MMMM dd, yyyy')}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Activity Report
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mt: 1,
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                },
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: activity.report }} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" color="textSecondary">
                Created: {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Last Modified: {format(new Date(activity.lastModified), 'MMM dd, yyyy HH:mm')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </MainLayout>
  );
};

export default ActivityDetails;

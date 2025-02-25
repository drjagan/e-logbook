import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getActivities, deleteActivity, setPage } from '../store/slices/activitySlice';
import { MainLayout } from '../components/Layout/MainLayout';
import { Activity } from '../types/activity';

const activityTypes = [
  'All',
  'Out Patients',
  'In Patients',
  'Procedures',
  'Research',
  'Teaching',
  'Seminars',
  'Presentations',
  'Outreach',
  'Laboratory',
];

const ActivityList = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { activities, loading, pagination } = useAppSelector((state) => state.activities);
  const [filters, setFilters] = useState({
    type: 'All',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
    };

    if (filters.type !== 'All') {
      params.type = filters.type;
    }
    if (filters.startDate) {
      params.startDate = filters.startDate;
    }
    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    dispatch(getActivities(params));
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    dispatch(setPage(1));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await dispatch(deleteActivity(id));
      dispatch(getActivities({
        page: pagination.page,
        limit: pagination.limit,
      }));
    }
  };

  return (
    <MainLayout>
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">Activities</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/activities/new')}
            >
              New Activity
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              label="Activity Type"
              value={filters.type}
              onChange={handleFilterChange('type')}
            >
              {activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              fullWidth
              label="Start Date"
              value={filters.startDate}
              onChange={handleFilterChange('startDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              fullWidth
              label="End Date"
              value={filters.endDate}
              onChange={handleFilterChange('endDate')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity: Activity) => (
              <TableRow key={activity._id}>
                <TableCell>{activity.title}</TableCell>
                <TableCell>{activity.type}</TableCell>
                <TableCell>
                  {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(activity.lastModified), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => navigate(`/activities/${activity._id}`)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => navigate(`/activities/${activity._id}/edit`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDelete(activity._id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10]}
        />
      </TableContainer>
    </MainLayout>
  );
};

export default ActivityList;

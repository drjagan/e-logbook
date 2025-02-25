import { useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getActivities, getActivityStats } from '../store/slices/activitySlice';
import { MainLayout } from '../components/Layout/MainLayout';
import { Activity, ActivityStats } from '../types/activity';

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { activities, stats, loading } = useAppSelector((state) => state.activities);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getActivityStats());
    dispatch(getActivities({ limit: 5 }));
  }, [dispatch]);

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  const totalActivities = stats?.byType.reduce((acc: number, curr: { count: number }) => acc + curr.count, 0) || 0;
  const monthlyTotal = stats?.monthly[0]?.count || 0;

  return (
    <MainLayout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}
        </Typography>
        <Typography color="textSecondary">
          Here's an overview of your activities
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total Activities" value={totalActivities} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Activities This Month" value={monthlyTotal} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Activity Types"
            value={stats?.byType.length || 0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity Distribution
            </Typography>
            <List>
              {stats?.byType.map((stat: { _id: string; count: number }) => (
                <div key={stat._id}>
                  <ListItem>
                    <ListItemText
                      primary={stat._id}
                      secondary={`${stat.count} activities`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {activities.slice(0, 5).map((activity: Activity) => (
                <div key={activity._id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.title}
                      secondary={`${activity.type} - ${format(
                        new Date(activity.activityDate),
                        'MMM dd, yyyy'
                      )}`}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default Dashboard;

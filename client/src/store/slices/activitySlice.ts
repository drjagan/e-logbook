import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { Activity, ActivityState } from '../../types/activity';

const initialState: ActivityState = {
  activities: [],
  selectedActivity: null,
  loading: false,
  error: null,
  stats: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// Get activities
export const getActivities = createAsyncThunk(
  'activities/getAll',
  async (params: { page?: number; limit?: number; type?: string; startDate?: string; endDate?: string }) => {
    const response = await axios.get('/activities', { params });
    return response.data;
  }
);

// Get activity by id
export const getActivityById = createAsyncThunk(
  'activities/getById',
  async (id: string) => {
    const response = await axios.get(`/activities/${id}`);
    return response.data;
  }
);

// Create activity
export const createActivity = createAsyncThunk(
  'activities/create',
  async (activityData: Partial<Activity>) => {
    const response = await axios.post('/activities', activityData);
    return response.data;
  }
);

// Update activity
export const updateActivity = createAsyncThunk(
  'activities/update',
  async ({ id, activityData }: { id: string; activityData: Partial<Activity> }) => {
    const response = await axios.put(`/activities/${id}`, activityData);
    return response.data;
  }
);

// Delete activity
export const deleteActivity = createAsyncThunk(
  'activities/delete',
  async (id: string) => {
    await axios.delete(`/activities/${id}`);
    return id;
  }
);

// Get activity statistics
export const getActivityStats = createAsyncThunk(
  'activities/getStats',
  async () => {
    const response = await axios.get('/activities/stats');
    return response.data;
  }
);

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearSelectedActivity: (state) => {
      state.selectedActivity = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get activities
      .addCase(getActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      // Get activity by id
      .addCase(getActivityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedActivity = action.payload.data;
      })
      .addCase(getActivityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activity';
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.unshift(action.payload.data);
        state.pagination.total += 1;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create activity';
      })
      // Update activity
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.activities.findIndex(
          (activity) => activity._id === action.payload.data._id
        );
        if (index !== -1) {
          state.activities[index] = action.payload.data;
        }
        state.selectedActivity = action.payload.data;
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update activity';
      })
      // Delete activity
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = state.activities.filter(
          (activity) => activity._id !== action.payload
        );
        state.pagination.total -= 1;
        if (state.selectedActivity?._id === action.payload) {
          state.selectedActivity = null;
        }
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete activity';
      })
      // Get activity statistics
      .addCase(getActivityStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getActivityStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activity statistics';
      });
  },
});

export const { clearSelectedActivity, clearError, setPage } = activitySlice.actions;
export default activitySlice.reducer;

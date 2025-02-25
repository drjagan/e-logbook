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

export const getActivities = createAsyncThunk(
  'activities/getActivities',
  async (params: { 
    page?: number; 
    limit?: number;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axios.get('/activities', { params });
    return response.data;
  }
);

export const getActivity = createAsyncThunk(
  'activities/getActivity',
  async (id: string) => {
    const response = await axios.get(`/activities/${id}`);
    return response.data;
  }
);

export const createActivity = createAsyncThunk(
  'activities/createActivity',
  async (activity: Partial<Activity>) => {
    const response = await axios.post('/activities', activity);
    return response.data;
  }
);

export const updateActivity = createAsyncThunk(
  'activities/updateActivity',
  async ({ id, activity }: { id: string; activity: Partial<Activity> }) => {
    const response = await axios.put(`/activities/${id}`, activity);
    return response.data;
  }
);

export const deleteActivity = createAsyncThunk(
  'activities/deleteActivity',
  async (id: string) => {
    await axios.delete(`/activities/${id}`);
    return id;
  }
);

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
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearSelectedActivity: (state) => {
      state.selectedActivity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.data;
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      .addCase(getActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedActivity = action.payload.data;
      })
      .addCase(getActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activity';
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.activities.unshift(action.payload.data);
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        const index = state.activities.findIndex(
          (activity) => activity._id === action.payload.data._id
        );
        if (index !== -1) {
          state.activities[index] = action.payload.data;
        }
        state.selectedActivity = action.payload.data;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.activities = state.activities.filter(
          (activity) => activity._id !== action.payload
        );
      })
      .addCase(getActivityStats.fulfilled, (state, action) => {
        state.stats = action.payload.data;
      });
  },
});

export const { setPage, clearSelectedActivity } = activitySlice.actions;

export default activitySlice.reducer;

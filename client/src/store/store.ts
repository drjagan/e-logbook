import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activityReducer from './slices/activitySlice';
import { ActivityState } from '../types/activity';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  activities: ActivityState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['activities.selectedActivity.createdAt'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

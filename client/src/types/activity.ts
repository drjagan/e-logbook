export interface Activity {
  _id: string;
  title: string;
  type: string;
  report: string;
  activityDate: string;
  lastModified: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityStats {
  byType: Array<{
    _id: string;
    count: number;
  }>;
  monthly: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
  }>;
}

export interface ActivityState {
  activities: Activity[];
  selectedActivity: Activity | null;
  loading: boolean;
  error: string | null;
  stats: ActivityStats | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

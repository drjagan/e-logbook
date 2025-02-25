import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createActivity,
  updateActivity,
  getActivity,
  clearSelectedActivity,
} from '../store/slices/activitySlice';
import { MainLayout } from '../components/Layout/MainLayout';

const activityTypes = [
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

const ActivityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedActivity, loading, error } = useAppSelector((state) => state.activities);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    report: '',
    activityDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (id) {
      dispatch(getActivity(id));
    }
    return () => {
      dispatch(clearSelectedActivity());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedActivity && id) {
      setFormData({
        title: selectedActivity.title,
        type: selectedActivity.type,
        report: selectedActivity.report,
        activityDate: new Date(selectedActivity.activityDate).toISOString().split('T')[0],
      });
    }
  }, [selectedActivity, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      report: content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await dispatch(updateActivity({ id, activity: formData })).unwrap();
      } else {
        await dispatch(createActivity(formData)).unwrap();
      }
      navigate('/activities');
    } catch (err) {
      // Error is handled by the reducer
    }
  };

  if (loading && id) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box mb={4}>
        <Typography variant="h4">
          {id ? 'Edit Activity' : 'New Activity'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Activity Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                label="Activity Date"
                name="activityDate"
                value={formData.activityDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Activity Report
              </Typography>
              <Editor
                value={formData.report}
                init={{
                  height: 500,
                  menubar: 'file edit view insert format tools table',
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'charmap',
                    'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'table', 'help', 'wordcount'
                  ],
                  toolbar: [
                    'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify',
                    'bullist numlist | table link charmap | searchreplace visualblocks code fullscreen help'
                  ].join(' | '),
                  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
                  table_default_attributes: {
                    border: '1'
                  },
                  table_default_styles: {
                    'border-collapse': 'collapse',
                    'width': '100%'
                  },
                  branding: false,
                  promotion: false,
                  statusbar: true
                }}
                onEditorChange={handleEditorChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/activities')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Activity'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </MainLayout>
  );
};

export default ActivityForm;

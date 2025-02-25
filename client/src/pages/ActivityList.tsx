import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams,
  GridPaginationModel,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { PDFViewer } from '@react-pdf/renderer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getActivities, deleteActivity, setPage } from '../store/slices/activitySlice';
import { MainLayout } from '../components/Layout/MainLayout';
import { Activity } from '../types/activity';
import { ActivityReport } from '../components/PDF/ActivityReport';

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
  const { activities = [], loading, pagination } = useAppSelector((state) => state.activities);
  const [filters, setFilters] = useState({
    type: 'All',
    startDate: '',
    endDate: '',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

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

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    dispatch(setPage(model.page + 1));
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'type', headerName: 'Type', flex: 1 },
    {
      field: 'activityDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => format(new Date(params.row.activityDate), 'MMM dd, yyyy'),
    },
    {
      field: 'lastModified',
      headerName: 'Last Modified',
      flex: 1,
      renderCell: (params) => format(new Date(params.row.lastModified), 'MMM dd, yyyy HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Activity>) => (
        <Box>
          <Tooltip title="View">
            <Button
              size="small"
              onClick={() => navigate(`/activities/${params.row._id}`)}
            >
              <VisibilityIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              size="small"
              onClick={() => navigate(`/activities/${params.row._id}/edit`)}
            >
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(params.row._id)}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleGenerateReport = () => {
    if (selectedIds.length > 0) {
      setPdfPreviewOpen(true);
    }
  };

  const selectedActivities = activities.filter((activity) => 
    selectedIds.includes(activity._id)
  );

  return (
    <MainLayout>
      <Box mb={4}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4">Activities</Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={handleGenerateReport}
                  disabled={selectedIds.length === 0}
                >
                  Generate Report
                </Button>
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

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={activities}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          disableRowSelectionOnClick
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={{
            page: pagination.page - 1,
            pageSize: pagination.limit,
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10]}
          loading={loading}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedIds(newSelection as string[]);
          }}
        />
      </Paper>

      <Dialog
        open={pdfPreviewOpen}
        onClose={() => setPdfPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Report Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ height: '70vh' }}>
            <PDFViewer width="100%" height="100%">
              <ActivityReport
                activities={selectedActivities}
                dateRange={{
                  startDate: filters.startDate || activities[0]?.activityDate || new Date().toISOString(),
                  endDate: filters.endDate || new Date().toISOString(),
                }}
                type={filters.type}
              />
            </PDFViewer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ActivityList;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://project-backend-f00j.onrender.com/api';

// 1. Admin ke liye global metrics thunk
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Data fetch nahi ho paya');
    }
  }
);

// 2. Member ke liye personal stats thunk (Naya 🚀)
export const fetchUserAssignedStats = createAsyncThunk(
  'dashboard/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE}/auth/getUserAssignedStats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'User stats fetch nahi ho paye');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: { projects: 0, tasks: 0, completed: 0, users: 0 },
    userStats: { assignedProjectsCount: 0, completedTasksCount: 0 }, // Member data ke liye separate key
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Global metrics logs
      .addCase(fetchDashboardMetrics.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Personal stats logs
      .addCase(fetchUserAssignedStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserAssignedStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserAssignedStats.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default dashboardSlice.reducer;
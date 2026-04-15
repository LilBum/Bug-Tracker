import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { request } from '../api';

export const fetchBugs = createAsyncThunk('bugs/fetchBugs', async () => {
  return request('/api/bugs');
});

export const createBug = createAsyncThunk('bugs/createBug', async (bug) => {
  return request('/api/bugs', {
    method: 'POST',
    body: JSON.stringify(bug),
  });
});

export const updateBug = createAsyncThunk(
  'bugs/updateBug',
  async ({ id, bug }) => {
    return request(`/api/bugs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bug),
    });
  }
);

export const completeBug = createAsyncThunk('bugs/completeBug', async (id) => {
  return request(`/api/bugs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: true }),
  });
});

export const deleteBug = createAsyncThunk('bugs/deleteBug', async (id) => {
  await request(`/api/bugs/${id}`, {
    method: 'DELETE',
  });

  return id;
});

export const bugSlice = createSlice({
  name: 'bugs',
  initialState: {
    bugs: [],
    loading: false,
    error: null,
  },
  reducers: {
    setBugs: (state, action) => {
      state.bugs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    markComplete: (state, action) => {
      const bugIndex = state.bugs.findIndex((bug) => bug._id === action.payload);

      if (bugIndex !== -1) {
        state.bugs[bugIndex].completed = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBugs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBugs.fulfilled, (state, action) => {
        state.loading = false;
        state.bugs = action.payload;
      })
      .addCase(fetchBugs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createBug.fulfilled, (state, action) => {
        state.bugs.unshift(action.payload);
      })
      .addCase(updateBug.fulfilled, (state, action) => {
        const index = state.bugs.findIndex((bug) => bug._id === action.payload._id);

        if (index !== -1) {
          state.bugs[index] = action.payload;
        }
      })
      .addCase(completeBug.fulfilled, (state, action) => {
        const index = state.bugs.findIndex((bug) => bug._id === action.payload._id);

        if (index !== -1) {
          state.bugs[index] = action.payload;
        }
      })
      .addCase(deleteBug.fulfilled, (state, action) => {
        state.bugs = state.bugs.filter((bug) => bug._id !== action.payload);
      });
  },
});

export const { setBugs, setLoading, setError, markComplete } = bugSlice.actions;

export const selectBugs = (state) => state.bugs.bugs;

export default bugSlice.reducer;

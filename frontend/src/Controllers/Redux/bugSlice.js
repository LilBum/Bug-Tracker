import { createSlice } from '@reduxjs/toolkit';

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
      const bugIndex = state.bugs.findIndex((bug) => bug.id === action.payload);
      if (bugIndex !== -1) {
        state.bugs[bugIndex].status = 'Completed';
      }
    },
  },
});

export const { setBugs, setLoading, setError, markComplete } = bugSlice.actions;

export const fetchBugs = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch(`http://localhost:3500/api/bugs/`);
    const data = await response.json();
    dispatch(setBugs(data));
  } catch (error) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const selectBugs = (state) => state.bugs.bugs;

export default bugSlice.reducer;

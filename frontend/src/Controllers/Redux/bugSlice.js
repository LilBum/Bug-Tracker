import { createSlice } from '@reduxjs/toolkit';
import { getAllBugs } from './bugController';

const slice = createSlice({
    name: "bug",
    initialState: [],
    reducers: {
        getBugs: state => {
            return (JSON.parse(state = getAllBugs()));
        },
        createBugs: (state, action) => {
            // ...
        },
        updateBug: (state, action) => {
            // ...
        },
        markComplete: (state, action) => {

        }
    }
});



export default slice.reducer;
export const { getBugs, createBugs, updateBug, markComplete } = slice.actions;

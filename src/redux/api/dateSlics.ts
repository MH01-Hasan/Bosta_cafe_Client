import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    startDate:new Date(),
    endDate:new Date(),
    userId:''
};

const dateslice = createSlice({
    name: 'date',
    initialState,
    reducers: {
        setStartDate: (state, action) => {
            return {
                ...state,
                startDate: action?.payload
            };
        },
        setEndDate: (state, action) => {
            return {
                ...state,
                endDate: action?.payload
            };
        },
        setUserId: (state, action) => {
            return {
                ...state,
                userId: action?.payload
            };
        },
    },
});

export const { setStartDate, setEndDate ,setUserId} = dateslice.actions;

export default dateslice.reducer;














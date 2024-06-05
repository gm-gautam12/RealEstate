import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        signInStart: (start) => {
            start.loading = true;
        },
        signInSuccess: (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state,data) => {
            state.currentUser = data.payload;
            state.loading = false;
            state.error = null;
            console.log(data, "====payload=====")
        },
        updateUserFailure: (state,payload) => {
            state.error = payload;
            state.loading = false;
        }
    }
});

export const { signInStart, signInSuccess, signInFailure,updateUserStart,updateUserSuccess,updateUserFailure } = userSlice.actions;
export default userSlice.reducer;
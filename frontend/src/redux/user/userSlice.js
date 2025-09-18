import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    currentUser : null,
    error : null,
    loadingAction: null,
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart : (state)=>{
            state.loadingAction = 'sigin';
            state.error = null;
        },
        signInSuccess : (state,action)=>{
            state.currentUser = action.payload;
            state.error = null;
            state.loadingAction = null;  
        },
        signInFailure : (state,action)=>{
            state.error = action.payload;
            state.loadingAction = null;
        },
        updateUserStart : (state)=>{
            state.loadingAction = 'update';
        },
        updateUserSuccess : (state,action)=>{
            state.currentUser = action.payload;
            state.loadingAction=null;
            state.error= null;
        },
        updateUserFailure : (state,action)=>{
            state.error = action.payload;
            state.loadingAction = null;
        },
        deleteUserStart : (state)=>{
            state.loadingAction = 'delete';
        },
        deleteUserSuccess : (state)=>{
            state.currentUser = null;
            state.loadingAction = null;
            state.error = null;
        },
        deleteUserFailure : (state,action)=>{
            state.error = action.payload;
            state.loadingAction = null;
        },
        signOutUserStart : (state)=>{
            state.loadingAction = 'signout';
        },
        signOutUserSuccess : (state)=>{
            state.currentUser = null;
            state.loadingAction = null;
            state.error = null;
        },
        signOutUserFailure : (state,action)=>{
            state.error = action.payload;
            state.loadingAction = null;
        },
        clearError: (state) => {
            state.error = null;
        }




    }
});

export const {signInStart,signInSuccess,signInFailure, updateUserFailure,updateUserStart,updateUserSuccess , deleteUserStart , deleteUserSuccess, deleteUserFailure, signOutUserFailure, signOutUserStart, signOutUserSuccess,clearError } = userSlice.actions;

export default userSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { httpClient } from '../../../http/services/HttpService';
import { buildSerializableResponse } from '../../../http/helpers';

export const fetchCreateUser = createAsyncThunk ('auth/fetchCreateUser', async ({name, email, password}) => {
   const response = await httpClient.createUser({}, {
      email: email,
      name: name,
      password: password
   });

   return buildSerializableResponse(response);
});

export const fetchLoginUser = createAsyncThunk ('auth/fetchLoginUser', async ({email, password}) => {
   const response = await httpClient.getUser({}, {
      email: email,
      password: password
   });
   return response.body;
})

export const authSlice = createSlice({ 
   name: 'auth',
   initialState: {
      status: 'not-authenticated', // 'checking', 'not-authenticated', 'authenticated'
      id: null,
      email: null,
      name: null,
      token: null,
      errorMessage: null,
   },
   reducers: {
      login: (state, {payload}) => {

      },
      logout: (state, {payload}) => {

      }
   },
   extraReducers(builder) {
     builder
       .addCase(fetchCreateUser.pending, (state) => {
         state.status = 'checking';
         state.id = null;
         state.email = null;
         state.name = null;
         state.token = null;
         state.errorMessage = null;
       })
       .addCase(fetchCreateUser.fulfilled, (state, action) => {
          state.status = 'not-authenticated';
          if (action.payload.statusCode === 200) {
              state.id = action.payload.body.id;
              state.name = action.payload.body.name;
          } else if (action.payload.statusCode === 400) {
              state.errorMessage = 'Bad request';   
          } else if (action.payload.statusCode === 409) {
              state.errorMessage = 'This email already exists.';   
          } else {
              state.errorMessage = 'Ups... something strange happened. Try again?';
          }
       })
       .addCase(fetchCreateUser.rejected, (state, action) => {
          state.status = 'not-authenticated';          
          if (action.payload.statusCode === 400) {
              state.errorMessage = 'Bad request';   
          } else if (action.payload.statusCode === 409) {
              state.errorMessage = 'This email already exists.';   
          } else {
              state.errorMessage = 'Ups... something strange happened. Try again?';
          }
       })
       .addCase(fetchLoginUser.pending, (state) => {
         state.status = 'checking';
       })
       .addCase(fetchLoginUser.fulfilled, (state, action) => {
         state.status = 'authenticated';
         state.id = action.payload.id;
         state.name = action.payload.name;
         state.email = action.payload.email;
         state.token = action.payload.token;
       })
       .addCase(fetchLoginUser.rejected, (state, action) => {
         state.status = 'not-authenticated';
         state.errorMessage = action.error.message;
       })
   }
});

export const { login, logout, checkingCredentials} = authSlice.actions;
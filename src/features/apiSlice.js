import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const idiomsApi = createApi({
  reducerPath: 'idiomsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/` 
  }),

  tagTypes: ['Idioms', 'Leaderboard'], 

  endpoints: (builder) => ({
   
    getIdioms: builder.query({
      query: (token) => ({
        url: 'idioms',
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: 'Idioms', id: _id })), 'Idioms']
          : ['Idioms'],
    }),

    //  ПОЛУЧЕНИЕ РЕЙТИНГА (Leaderboard)
  
    getLeaderboard: builder.query({
      query: (token) => ({
        url: 'users/leaderboard',
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
      providesTags: ['Leaderboard'],
    }),

   
    addIdiom: builder.mutation({
      query: ({ body, token }) => ({
        url: 'idioms',
        method: 'POST',
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Idioms'],
    }),

  
    deleteIdiom: builder.mutation({
      query: ({ id, token }) => ({
        url: `idioms/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Idioms'],
    }),
  }),
});

export const { 
  useGetIdiomsQuery, 
  useGetLeaderboardQuery, 
  useAddIdiomMutation, 
  useDeleteIdiomMutation 
} = idiomsApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const idiomsApi = createApi({
  reducerPath: 'idiomsApi',
 
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_URL}/api/` 
  }),
  tagTypes: ['Idioms'], 

  endpoints: (builder) => ({
    
    // 1.  (GET) 
    getIdioms: builder.query({
      query: (token) => ({
        url: 'idioms',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ['Idioms'],
    }),

    // 2.  (POST)
    addIdiom: builder.mutation({
      query: ({ body, token }) => ({
        url: 'idioms',
        method: 'POST',
        body: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: ['Idioms'],
    }),

    // 3.  (DELETE)
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
  useAddIdiomMutation, 
  useDeleteIdiomMutation 
} = idiomsApi;

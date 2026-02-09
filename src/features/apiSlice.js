import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const idiomsApi = createApi({
  reducerPath: 'idiomsApi',
  // Используем переменную окружения для гибкости между локальной разработкой и деплоем
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${import.meta.env.VITE_API_URL}/api/` 
  }),
  tagTypes: ['Idioms'], 

  endpoints: (builder) => ({
    
    // 1. Получение всех идиом (GET) 
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

    // 2. Добавление новой идиомы (POST)
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

    // 3. Удаление идиомы (DELETE)
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
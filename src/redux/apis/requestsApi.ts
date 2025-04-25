import { api } from '../api';

export const requestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query({
      query: () => '/api/admin/requests',
      providesTags: ['Requests']
    }),
    getRequestById: builder.query({
      query: (id) => `/api/admin/requests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Requests', id }]
    }),
    updateRequest: builder.mutation({
      query: ({ id, ...request }) => ({
        url: `/api/admin/requests/${id}`,
        method: 'PATCH',
        body: request
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Requests', id },
        'Requests',
        'Services'
      ]
    }),
    createRequest: builder.mutation({
      query: (request) => ({
        url: '/api/admin/requests',
        method: 'POST',
        body: request
      }),
      invalidatesTags: ['Requests']
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useUpdateRequestMutation,
  useCreateRequestMutation
} = requestsApi;
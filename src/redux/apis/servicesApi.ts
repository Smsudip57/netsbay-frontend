import { api } from '../api';

export const servicesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: () => '/api/admin/services',
      providesTags: ['Services']
    }),
    getServiceById: builder.query({
      query: (id) => `/api/admin/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Services', id }]
    }),
    createService: builder.mutation({
      query: (service) => ({
        url: '/api/admin/services',
        method: 'POST',
        body: service
      }),
      invalidatesTags: ['Services']
    }),
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/api/admin/services/${id}`,
        method: 'PATCH',
        body: service
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Services', id },
        'Services',
        'Transactions'
      ]
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/api/admin/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services']
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation
} = servicesApi;
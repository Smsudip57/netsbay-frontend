import { api } from '../api';

export const transactionsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => '/api/admin/transactions',
      providesTags: ['Transactions']
    }),
    getTransactionById: builder.query({
      query: (id) => `/api/admin/transactions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Transactions', id }]
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery
} = transactionsApi;
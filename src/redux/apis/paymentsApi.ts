import { api } from '../api';

export const paymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: () => '/api/admin/payments',
      providesTags: ['Payments']
    }),
    createPayment: builder.mutation({
      query: (payment) => ({
        url: '/api/payments',
        method: 'POST',
        body: payment
      }),
      invalidatesTags: ['Payments', 'Services', 'Transactions']
    }),
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/api/payments/verify',
        method: 'POST',
        body: paymentData
      }),
      invalidatesTags: ['Payments', 'Services', 'Transactions']
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useVerifyPaymentMutation
} = paymentsApi;
import { api } from '../api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => '/api/admin/products',
      providesTags: ['Products']
    }),
    
    // Get single product by ID
    getProductById: builder.query({
      query: (id) => `/api/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }]
    }),
    
    // Create new product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/admin/products',
        method: 'POST',
        body: productData
      }),
      invalidatesTags: ['Products']
    }),
    
    // Update existing product
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/admin/products/${id}`,
        method: 'PATCH',
        body: productData
      }),
      invalidatesTags: ['Products', 'Services']
    }),
    
    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Products']
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productsApi;
// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query/react';
// import { api } from './api';
// import authReducer from '../features/auth/authSlice';
// import servicesReducer from '../features/services/servicesSlice';
// import requestsReducer from '../features/requests/requestsSlice';
// import paymentsReducer from '../features/payments/paymentsSlice';
// import productsReducer from '../features/products/productsSlice';

// export const store = configureStore({
//   reducer: {
//     [api.reducerPath]: api.reducer,
//     auth: authReducer,
//     services: servicesReducer,
//     requests: requestsReducer,
//     payments: paymentsReducer,
//     products: productsReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// });

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
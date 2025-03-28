import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PaymentStatus() {
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get transaction ID from URL query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const txn = urlParams.get('txn');
        
        if (!txn) {
          setError('Transaction ID not found');
          setLoading(false);
          return;
        }

        // Fetch payment status from API
        const response = await axios.get('/api/payment/status', {
          params: { merchantTransactionId: txn },
          withCredentials: true,
        });

        setPaymentSuccess(response.data?.success || false);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payment status');
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      {loading && (
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
          <p className='mt-4 text-lg'>Processing payment...</p>
        </div>
      )}

      {!loading && error && (
        <div className='flex flex-col items-center text-red-600'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className='text-xl font-bold mt-4'>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && paymentSuccess && (
        <div className='flex flex-col items-center text-green-600'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className='text-xl font-bold mt-4'>Payment Successful</h2>
          <p>Your transaction has been processed successfully.</p>
            <Link to='/dashboard' className='mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg'>Go to Dashboard</Link>
        </div>
      )}

      {!loading && !error && !paymentSuccess && (
        <div className='flex flex-col items-center text-red-600'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h2 className='text-xl font-bold mt-4'>Payment Failed</h2>
          <p>We couldn't process your payment. <Link to='/dashboard/purchase-netcoins' className='underline'>Please try again</Link> .</p>
        </div>
      )}
    </div>
  );
}
// PayPalCheckout.jsx - PayPal Payment Integration Component
import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { FaPaypal, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const PayPalCheckout = ({ 
  orderId, 
  totalAmount, 
  onSuccess, 
  onError,
  orderItems = []
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showPayPal, setShowPayPal] = useState(false);

  // PayPal Client ID from environment variable
  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 
                           process.env.REACT_APP_PAYPAL_CLIENT_ID;

  const initialOptions = {
    "client-id": PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // Create PayPal Order
  const createOrder = async (data, actions) => {
    try {
      setLoading(true);
      const response = await api.post('/payments/paypal/create-order', {
        orderId: orderId,
        amount: totalAmount.toFixed(2),
        currency: 'USD'
      });

      if (response.data && response.data.paypalOrderId) {
        return response.data.paypalOrderId;
      }
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      toast.error('Failed to initialize PayPal payment');
    } finally {
      setLoading(false);
    }
  };

  // Approve PayPal Payment
  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      const response = await api.post('/payments/paypal/capture-order', {
        orderId: orderId,
        paypalOrderId: data.orderID,
        payerId: data.payerID
      });

      if (response.data && response.data.status === 'COMPLETED') {
        setPaymentStatus('success');
        toast.success('Payment successful!');
        if (onSuccess) onSuccess(response.data);
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error('Payment failed');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paypal-checkout-container">
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaPaypal className="text-blue-600" />
            PayPal Payment
          </h2>
          <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {!showPayPal ? (
          <button
            onClick={() => setShowPayPal(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-3"
          >
            <FaPaypal size={24} />
            Pay with PayPal
          </button>
        ) : (
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};

export default PayPalCheckout;

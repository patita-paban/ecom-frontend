import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById } from '../../store/actions';
import api from '../../api/api';
import { 
  FaCheckCircle, 
  FaBox, 
  FaTruck, 
  FaMapMarkerAlt, 
  FaCreditCard,
  FaCalendarAlt,
  FaReceipt,
  FaArrowLeft,
  FaDownload,
  FaEnvelope,
  FaSpinner
} from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';




const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  
  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);
  
  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'from-yellow-400 to-orange-500',
      'PAYMENT CONFIRMED': 'from-blue-400 to-blue-600',
      PROCESSING: 'from-purple-400 to-purple-600',
      SHIPPED: 'from-indigo-400 to-indigo-600',
      DELIVERED: 'from-green-400 to-green-600',
      CANCELLED: 'from-red-400 to-red-600'
    };
    return colors[status] || 'from-gray-400 to-gray-600';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  const calculateSubtotal = () => {
    return order?.orderItems?.reduce((sum, item) => 
      sum + (item.orderedProductPrice * item.quantity), 0) || 0;
  };
  const downloadInvoice = async (orderId) => {
  const response = await api.get(`/orders/${orderId}/invoice`, {
    responseType: 'blob'
  });
  
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${orderId}.pdf`;
  link.click();
};
  
  const getTimeline = () => {
  if (!order) return [];

  // Normalize backend status (VERY IMPORTANT)
  const currentStatus = order.orderStatus?.toUpperCase().trim();

  const steps = [
    "ORDER PLACED",
    "PAYMENT CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED"
  ];
  

  // Map backend → UI steps
  const statusMap = {
    "PENDING": "ORDER PLACED",
    "ORDER_PLACED": "ORDER PLACED",
    "PAYMENT CONFIRMED": "PAYMENT CONFIRMED",
    "PAYMENT_CONFIRMED": "PAYMENT CONFIRMED",
    "PROCESSING": "PROCESSING",
    "SHIPPED": "SHIPPED",
    "DELIVERED": "DELIVERED"
  };

  const mappedStatus = statusMap[currentStatus] || "ORDER PLACED";

  const currentIndex = steps.indexOf(mappedStatus);

  console.log("DEBUG STATUS:", currentStatus);
  console.log("MAPPED STATUS:", mappedStatus);
  console.log("INDEX:", currentIndex);

  return steps.map((step, index) => ({
    status: step,
    completed: index <= currentIndex,
    date:
      step === "ORDER PLACED" ? order.orderDate :
      step === "PAYMENT CONFIRMED" ? order.payment?.paymentDate :
      null
  }));
};
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="mx-auto text-6xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <FaCheckCircle className="text-green-500 text-3xl mr-3" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Order Confirmed!
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Thank you for your purchase</p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex gap-3">
                <button 
                  onClick={() => downloadInvoice(order.orderId)}
                  className="flex items-center px-4 py-2 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  <FaDownload className="mr-2" />
                  Invoice
                </button>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
                  <FaEnvelope className="mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
            
            {/* Order Info Bar */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center text-indigo-600 mb-1">
                  <FaReceipt className="mr-2" />
                  <span className="text-sm font-semibold">Order Number</span>
                </div>
                <p className="text-xl font-bold text-gray-800">#{order.orderId}</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center text-purple-600 mb-1">
                  <FaCalendarAlt className="mr-2" />
                  <span className="text-sm font-semibold">Order Date</span>
                </div>
                <p className="text-xl font-bold text-gray-800">{formatDate(order.orderDate)}</p>
              </div>
              
              <div className={`bg-gradient-to-br ${getStatusColor(order.orderStatus)} rounded-xl p-4`}>
                <div className="flex items-center text-white mb-1">
                  <FaBox className="mr-2" />
                  <span className="text-sm font-semibold">Status</span>
                </div>
                <p className="text-xl font-bold text-white">{order.orderStatus}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBox className="mr-3 text-indigo-600" />
                Order Items ({order.orderItems?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.orderItems?.map((item, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50 border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <img 
  src={
    item.product?.image 
      ? item.product.image.startsWith("http")
        ? item.product.image
        : `http://localhost:8089/images/${item.product.image}`
      : 'https://via.placeholder.com/100'
  }
  alt={item.product?.productName}
  className="w-24 h-24 object-cover rounded-lg shadow-md"
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/100?text=Product';
  }}
/>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {item.product?.productName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Quantity: <span className="font-semibold">{item.quantity}</span>
                      </p>
                      
                      <div className="flex items-center gap-3">
                        {item.discount > 0 && (
                          <span className="text-gray-400 line-through text-sm">
                            {formatPrice(item.product?.price)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-indigo-600">
                          {formatPrice(item.orderedProductPrice)}
                        </span>
                        {item.discount > 0 && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {item.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatPrice(item.orderedProductPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaTruck className="mr-3 text-indigo-600" />
                Order Timeline
              </h2>
              
              <div className="relative">
                {getTimeline().map((step, index) => (
                  <div key={index} className="flex gap-4 mb-8 last:mb-0">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-gradient-to-br from-green-400 to-green-600' 
                          : 'bg-gray-300'
                      } shadow-lg z-10`}>
                        {step.completed ? (
                          <FaCheckCircle className="text-white text-xl" />
                        ) : (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      {index < getTimeline().length - 1 && (
                        <div className={`w-1 h-full ${
                          step.completed ? 'bg-green-400' : 'bg-gray-300'
                        } absolute top-12`}></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <h3 className={`font-bold text-lg ${
                        step.completed ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {step.status}
                      </h3>
                      {step.date && (
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(step.date)}
                        </p>
                      )}
                      {!step.date && !step.completed && (
                        <p className="text-sm text-gray-400 mt-1">
                          Pending
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-indigo-600" />
                Shipping Address
              </h2>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                <p className="font-semibold text-gray-800">{order.address?.buildingName}</p>
                <p className="text-gray-600">{order.address?.street}</p>
                <p className="text-gray-600">
                  {order.address?.city}, {order.address?.state} {order.address?.pincode}
                </p>
                <p className="text-gray-600">{order.address?.country}</p>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCreditCard className="mr-3 text-indigo-600" />
                Payment Information
              </h2>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold text-gray-800">{order.payment?.paymentMethod || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Status</span>
                  <span className="flex items-center text-green-600 font-semibold">
                    <FaCheckCircle className="mr-1" />
                    {order.payment?.pgStatus || 'Completed'}
                  </span>
                </div>
                {order.payment?.pgPaymentId && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="text-xs text-gray-500">{order.payment.pgPaymentId.substring(0, 20)}...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Need Help?</h2>
              <p className="text-indigo-100 mb-4 text-sm">
                Our customer support team is here to assist you
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <FaEnvelope className="mr-2" />
                  support@ecommerce.com
                </p>
                <p className="flex items-center">
                  Email: {order.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

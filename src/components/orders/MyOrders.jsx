import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../store/actions';
import { 
  FaBox, 
  FaShoppingBag, 
  FaSearch,
  FaCalendarAlt,
  FaReceipt,
  FaChevronRight,
  FaSpinner
} from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';

const MyOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // ✅ NORMALIZE STATUS (MAIN FIX)
  const normalizeStatus = (status) => {
    return status?.toLowerCase().replace(/_/g, '').trim();
  };

  // ✅ FILTERED ORDERS (FIXED)
  const filteredOrders = orders?.filter(order => {
    const normalizedOrderStatus = normalizeStatus(order.orderStatus);
    const normalizedFilter = normalizeStatus(filter);

    const matchesFilter =
      filter === 'ALL' || normalizedOrderStatus.includes(normalizedFilter);

    const matchesSearch =
      order.orderId?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  }) || [];

  // ✅ COUNT FUNCTION (FIXED)
  const getCount = (statusValue) => {
    return orders?.filter(o =>
      normalizeStatus(o.orderStatus).includes(statusValue)
    ).length || 0;
  };

  // ✅ FILTER BUTTONS (FIXED)
  const filters = [
    { label: 'All Orders', value: 'ALL', count: orders?.length || 0 },
    { label: 'Processing', value: 'processing', count: getCount('processing') },
    { label: 'Shipped', value: 'shipped', count: getCount('shipped') },
    { label: 'Delivered', value: 'delivered', count: getCount('delivered') }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        bg: 'from-yellow-400 to-orange-500',
        text: 'text-yellow-700',
        lightBg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: '⏳'
      },
      'PAYMENT CONFIRMED': {
        bg: 'from-blue-400 to-blue-600',
        text: 'text-blue-700',
        lightBg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: '💳'
      },
      PROCESSING: {
        bg: 'from-purple-400 to-purple-600',
        text: 'text-purple-700',
        lightBg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: '⚙️'
      },
      SHIPPED: {
        bg: 'from-indigo-400 to-indigo-600',
        text: 'text-indigo-700',
        lightBg: 'bg-indigo-50',
        border: 'border-indigo-200',
        icon: '🚚'
      },
      DELIVERED: {
        bg: 'from-green-400 to-green-600',
        text: 'text-green-700',
        lightBg: 'bg-green-50',
        border: 'border-green-200',
        icon: '✅'
      },
      CANCELLED: {
        bg: 'from-red-400 to-red-600',
        text: 'text-red-700',
        lightBg: 'bg-red-50',
        border: 'border-red-200',
        icon: '❌'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  My Orders
                </h1>
                <p className="text-gray-600">Track and manage your order history</p>
              </div>

              <div className="text-center px-6 py-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                <p className="text-3xl font-bold text-indigo-600">{orders?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>

            {/* SEARCH + FILTER */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-4 py-3 rounded-xl font-semibold ${
                      filter === f.value
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white text-gray-600 border-2 border-gray-200'
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Found</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.orderStatus);
              const firstProduct = order.orderItems?.[0]?.product;

              return (
                <div
                  key={order.orderId}
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer p-6"
                >
                  <div className="flex gap-4">

                    {/* IMAGE */}
                    <img 
                      src={
                        firstProduct?.image 
                          ? firstProduct.image.startsWith("http")
                            ? firstProduct.image
                            : `http://localhost:8089/images/${firstProduct.image}`
                          : "https://via.placeholder.com/150/EEF2FF/6366F1?text=Cartify"
                      }
                      alt="Order"
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150/EEF2FF/6366F1?text=Cartify";
                      }}
                    />

                    {/* INFO */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        Order #{order.orderId}
                      </h3>

                      <p className="text-gray-600">
                        {formatDate(order.orderDate)}
                      </p>

                      <span className={`px-3 py-1 rounded-full text-xs ${statusConfig.lightBg} ${statusConfig.text}`}>
                        {order.orderStatus}
                      </span>

                      <p className="mt-2 font-bold text-indigo-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.orderId}`);
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
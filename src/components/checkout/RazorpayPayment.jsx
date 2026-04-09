import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const RazorpayPayment = () => {
  const { totalPrice } = useSelector((state) => state.carts);

  const handlePayment = async () => {
    try {
      // Step 1: Create order from backend
      const { data } = await axios.post(
        `http://localhost:8089/payment/create-order?amount=${totalPrice}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const order = JSON.parse(data);

      // Step 2: Razorpay options
      const options = {
        key: "rzp_test_SZYXFlgPz1oon1", // 🔴 replace with your key
        amount: order.amount,
        currency: order.currency,
        name: "Cartify",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:8089/api/payment/verify",
              response,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            toast.success("Payment Successful 🎉");
            window.location.href = "/orders";

          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: "Customer",
          email: "test@gmail.com",
        },

        theme: {
          color: "#6366F1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("Payment Failed");
    }
  };

  return (
    <div className="h-96 flex flex-col justify-center items-center">
      <button
        onClick={handlePayment}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
      >
        Pay with Razorpay
      </button>
    </div>
  );
};

export default RazorpayPayment;
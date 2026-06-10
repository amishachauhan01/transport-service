import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);

      // ✅ FIXED API ENDPOINT
      const res = await API.get("/orders/my-orders");

      console.log("MY ORDERS:", res.data);

      setOrders(res.data.orders || []);
      setError("");

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {/* LOADING */}
      {loading && <p>Loading orders...</p>}

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* NO ORDERS */}
      {!loading && orders.length === 0 && (
        <p>No orders found</p>
      )}

      {/* ORDERS LIST */}
      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/user/order/${order._id}`)}
        >
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Product:</b> {order.productName}</p>
          <p><b>Pickup:</b> {order.pickupLocation}</p>
          <p><b>Delivery:</b> {order.deliveryLocation}</p>
          <p><b>Weight:</b> {order.weight} kg</p>
          <p><b>Status:</b> {order.status}</p>
          

        </div>
      ))}
    </div>
  );
}
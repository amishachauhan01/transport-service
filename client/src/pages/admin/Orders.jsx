import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders");
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
      <h2>All Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <p><b>ID:</b> {order._id}</p>
            <p><b>Product:</b> {order.productName}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Customer:</b> {order.customer?.name || "N/A"}</p>
            <p><b>Vehicle:</b> {order.vehicle?.vehicleNumber || "None"}</p>
            <p><b>Driver:</b> {order.driver?.name || "None"}</p>
          </div>
        ))
      )}
    </div>
  );
}
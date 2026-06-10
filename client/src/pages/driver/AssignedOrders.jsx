import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function AssignedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/driver-orders");

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Assigned Orders</h1>

      {orders.length === 0 ? (
        <p>No assigned orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Product:</strong> {order.productName}
            </p>

            <p>
              <strong>Pickup:</strong> {order.pickupLocation}
            </p>

            <p>
              <strong>Delivery:</strong> {order.deliveryLocation}
            </p>

            <p>
              <strong>Weight:</strong> {order.weight} kg
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <button
              onClick={() =>
                navigate(`/driver/delivery/${order._id}`)
              }
              style={{
                padding: "10px 15px",
                cursor: "pointer",
              }}
            >
              Deliver Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}
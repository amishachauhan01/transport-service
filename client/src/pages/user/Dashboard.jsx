import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH MY ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/orders/my-orders");

      setOrders(res.data.orders || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // STATS
  const total = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const delivered = orders.filter(o => o.status === "delivered").length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Dashboard</h1>

      <p>Welcome, <b>{user?.name}</b></p>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <div style={cardStyle}>Total Orders: {total}</div>
        <div style={cardStyle}>Pending: {pending}</div>
        <div style={cardStyle}>Delivered: {delivered}</div>
      </div>

      {/* BUTTONS */}
      <button onClick={() => navigate("/user/create-order")}>
        + Create Order
      </button>

      <button onClick={() => navigate("/user/orders")} style={{ marginLeft: "10px" }}>
        My Orders
      </button>

      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>

      <hr />

      {/* ORDERS PREVIEW */}
      <h2>Recent Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.slice(0, 3).map((order) => (
          <div
            key={order._id}
            style={orderCard}
            onClick={() => navigate(`/user/order/${order._id}`)}
          >
            <p><b>{order.productName}</b></p>
            <p>{order.pickupLocation} → {order.deliveryLocation}</p>
            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

// styles
const cardStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  minWidth: "120px",
};

const orderCard = {
  border: "1px solid #ddd",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "8px",
  cursor: "pointer",
};
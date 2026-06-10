import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function DriverDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH ASSIGNED ORDERS =================
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get("/orders/driver-orders");

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

  // ================= UPDATE STATUS =================
  const updateStatus = async (orderId, status) => {
    try {
      await API.put("/orders/update-status", {
        orderId,
        status,
      });

      alert("Status Updated Successfully");

      fetchOrders(); // refresh
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚚 Driver Dashboard</h1>

      <button
        onClick={() => navigate("/driver/orders")}
        style={{
          padding: "15px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        View Full Assigned Orders Page
      </button>

      <hr />

      <h2>📦 Assigned Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No Assigned Orders</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
            }}
          >
            <h3>{order.productName}</h3>

            <p>
              <b>Pickup:</b> {order.pickupLocation}
            </p>

            <p>
              <b>Delivery:</b> {order.deliveryLocation}
            </p>

            <p>
              <b>Status:</b> {order.status}
            </p>

            <p>
              <b>Customer:</b>{" "}
              {order.customer?.name || "N/A"}
            </p>

            {/* STATUS BUTTONS */}
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => updateStatus(order._id, "picked")}
                style={{ padding: "8px", cursor: "pointer" }}
              >
                Picked
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "on_the_way")
                }
                style={{
                  marginLeft: "10px",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                On The Way
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "delivered")
                }
                style={{
                  marginLeft: "10px",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                Delivered
              </button>
            </div>

            {/* TRACK BUTTON */}
            <button
              onClick={() =>
                navigate(`/driver/delivery/${order._id}`)
              }
              style={{
                marginTop: "10px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              Open Delivery Form
            </button>
          </div>
        ))
      )}
    </div>
  );
}
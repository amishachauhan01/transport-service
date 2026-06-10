import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const res = await API.get("/orders/my-orders");

      const foundOrder = res.data.orders.find(
        (o) => o._id === id
      );

      if (!foundOrder) {
        setError("Order not found");
      } else {
        setOrder(foundOrder);
      }
    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          "Error loading order"
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/orders/invoice/${order._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Invoice download failed");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order._id}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.log(error);
    alert("Invoice download failed");
  }
};

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px" }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Details</h2>

      {order && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <p>
            <b>Order ID:</b> {order._id}
          </p>

          <p>
            <b>Product:</b> {order.productName}
          </p>

          <p>
            <b>Pickup:</b> {order.pickupLocation}
          </p>

          <p>
            <b>Delivery:</b> {order.deliveryLocation}
          </p>

          <p>
            <b>Weight:</b> {order.weight} kg
          </p>

          <p>
            <b>Status:</b> {order.status}
          </p>

          <br />

          <button
            onClick={() =>
              navigate(`/user/track/${order._id}`)
            }
            style={{
              padding: "10px 15px",
              cursor: "pointer",
            }}
          >
            Track Order
          </button>

          
            <button
  onClick={downloadInvoice}
  style={{
    gap : "30px",
    padding: "10px 15px",
    cursor: "pointer",
  }}
>
  Download Invoice
</button>
          
            

        </div>
      )}
    </div>
  );
}
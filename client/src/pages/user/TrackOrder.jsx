import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

export default function TrackOrder() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await API.get("/orders/my-orders");

      const foundOrder = res.data.orders.find(
        (o) => o._id === id
      );

      setOrder(foundOrder);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return "20%";
      case "assigned":
        return "40%";
      case "picked":
        return "60%";
      case "on_the_way":
        return "80%";
      case "delivered":
        return "100%";
      default:
        return "0%";
    }
  };

  if (loading) return <h2>Loading...</h2>;

  if (!order) return <h2>Order Not Found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Track Order</h1>

      <p>
        <strong>Product:</strong>{" "}
        {order.productName}
      </p>

      <p>
        <strong>Pickup:</strong>{" "}
        {order.pickupLocation}
      </p>

      <p>
        <strong>Delivery:</strong>{" "}
        {order.deliveryLocation}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {order.status}
      </p>

      <br />

      <div
        style={{
          width: "100%",
          background: "#ddd",
          height: "15px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: getProgress(order.status),
            background: "green",
            height: "15px",
            borderRadius: "10px",
            transition: "0.5s",
          }}
        />
      </div>

      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Pending</span>
        <span>Assigned</span>
        <span>Picked</span>
        <span>On The Way</span>
        <span>Delivered</span>
      </div>
    </div>
  );
}
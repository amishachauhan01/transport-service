import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function DeliveryForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!status) {
      alert("Select status first");
      return;
    }

    try {
      setLoading(true);

      await API.put("/orders/update-status", {
        orderId: id,
        status: status,
      });

      alert("Status Updated Successfully");

      navigate("/driver/orders");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Delivery Form</h2>

      <p>Order ID: {id}</p>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          padding: "10px",
          width: "200px",
          marginTop: "10px",
        }}
      >
        <option value="">Select Status</option>
        <option value="picked">Picked</option>
        <option value="on_the_way">On The Way</option>
        <option value="delivered">Delivered</option>
      </select>

      <br /><br />

      <button
        onClick={handleUpdate}
        disabled={loading}
        style={{
          padding: "10px 15px",
          cursor: "pointer",
        }}
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await API.get("/reports");
      setData(res.data.reports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>📊 Admin Reports Dashboard</h1>

      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        
        <div style={card}>
          <h3>Total Orders</h3>
          <h2>{data.totalOrders}</h2>
        </div>

        <div style={card}>
          <h3>Pending</h3>
          <h2>{data.pendingOrders}</h2>
        </div>

        <div style={card}>
          <h3>Assigned</h3>
          <h2>{data.assignedOrders}</h2>
        </div>

        <div style={card}>
          <h3>Delivered</h3>
          <h2>{data.deliveredOrders}</h2>
        </div>

      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  width: "150px",
  textAlign: "center",
};
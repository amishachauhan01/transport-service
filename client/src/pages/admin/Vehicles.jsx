import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    try {
      const res = await API.get("/vehicles");
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Vehicles</h2>

      {vehicles.map((v) => (
        <div
          key={v._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p><b>Vehicle No:</b> {v.vehicleNumber}</p>
          <p><b>Type:</b> {v.type}</p>
          <p>
            <b>Status:</b>{" "}
            {v.isAvailable ? "Available" : "Busy"}
          </p>
        </div>
      ))}
    </div>
  );
}
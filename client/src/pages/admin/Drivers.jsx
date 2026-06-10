import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = async () => {
    try {
      const res = await API.get("/auth/drivers");
      setDrivers(res.data.drivers || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Drivers</h2>

      {drivers.map((d) => (
        <div
          key={d._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p><b>Name:</b> {d.name}</p>
          <p><b>Email:</b> {d.email}</p>
          <p><b>Phone:</b> {d.phone}</p>
        </div>
      ))}
    </div>
  );
}
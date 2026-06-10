import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [selectedDriver, setSelectedDriver] = useState({});

  const navigate = useNavigate();

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH EXTRA DATA =================
  const fetchExtraData = async () => {
    try {
      const vehicleRes = await API.get("/vehicles");
      const driverRes = await API.get("/auth/drivers");
      const reportRes = await API.get("/reports");

      setVehicles(vehicleRes.data.vehicles || []);
      setDrivers(driverRes.data.drivers || []);
      setReports(reportRes.data.reports || {});
    } catch (error) {
      console.log("EXTRA DATA ERROR:", error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchOrders();
    await fetchExtraData();
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= ASSIGN VEHICLE =================
  const handleAssignVehicle = async (orderId) => {
    const vehicleId = selectedVehicle[orderId];

    if (!vehicleId) {
      alert("Select Vehicle");
      return;
    }

    try {
      await API.put("/orders/assign-vehicle", {
        orderId,
        vehicleId,
      });

      alert("Vehicle Assigned Successfully");
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= ASSIGN DRIVER =================
  const handleAssignDriver = async (orderId) => {
    const driverId = selectedDriver[orderId];

    if (!driverId) {
      alert("Select Driver");
      return;
    }

    try {
      await API.put("/orders/assign-driver", {
        orderId,
        driverId,
      });

      alert("Driver Assigned Successfully");
      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= DOWNLOAD INVOICE =================
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/orders/invoice/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Invoice Download Failed");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚀 Admin Dashboard</h1>

      {/* ================= REPORTS SECTION ================= */}
      {reports && (
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div style={card}>
            <h3>Total</h3>
            <h2>{reports.totalOrders}</h2>
          </div>

          <div style={card}>
            <h3>Pending</h3>
            <h2>{reports.pendingOrders}</h2>
          </div>

          <div style={card}>
            <h3>Assigned</h3>
            <h2>{reports.assignedOrders}</h2>
          </div>

          <div style={card}>
            <h3>Delivered</h3>
            <h2>{reports.deliveredOrders}</h2>
          </div>

          <button
            onClick={() => navigate("/admin/reports")}
            style={{
              padding: "15px",
              cursor: "pointer",
              background: "green",
              color: "white",
            }}
          >
            View Full Reports
          </button>
        </div>
      )}

      <hr />

      {/* ================= ORDERS ================= */}
      {orders.map((order) => (
        <div key={order._id} style={box}>
          <p><b>Product:</b> {order.productName}</p>
          <p><b>Route:</b> {order.pickupLocation} → {order.deliveryLocation}</p>
          <p><b>Status:</b> {order.status}</p>

          <p><b>Vehicle:</b> {order.vehicle?.vehicleNumber || "Not Assigned"}</p>
          <p><b>Driver:</b> {order.driver?.name || "Not Assigned"}</p>

          {/* VEHICLE */}
          <select
            value={selectedVehicle[order._id] || ""}
            onChange={(e) =>
              setSelectedVehicle({
                ...selectedVehicle,
                [order._id]: e.target.value,
              })
            }
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vehicleNumber}
              </option>
            ))}
          </select>

          <button onClick={() => handleAssignVehicle(order._id)}>
            Assign Vehicle
          </button>

          <br /><br />

          {/* DRIVER */}
          <select
            value={selectedDriver[order._id] || ""}
            onChange={(e) =>
              setSelectedDriver({
                ...selectedDriver,
                [order._id]: e.target.value,
              })
            }
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <button onClick={() => handleAssignDriver(order._id)}>
            Assign Driver
          </button>

          <br /><br />

          {/* INVOICE */}
          <button onClick={() => downloadInvoice(order._id)}>
            📄 Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
}

// ================= STYLES =================
const box = {
  border: "1px solid #ddd",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
};

const card = {
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "8px",
  textAlign: "center",
};
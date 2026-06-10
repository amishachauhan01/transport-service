import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🚚 Logistics App</h2>

      <div style={styles.links}>
        {/* COMMON */}
        <Link to="/" style={styles.link}>Home</Link>

        {/* USER */}
        {user?.role === "user" && (
          <>
            <Link to="/user/create-order" style={styles.link}>
              Create Order
            </Link>
            <Link to="/user/orders" style={styles.link}>
              My Orders
            </Link>
          </>
        )}

        {/* DRIVER */}
        {user?.role === "driver" && (
          <>
            <Link to="/driver/dashboard" style={styles.link}>
              Driver Dashboard
            </Link>
            <Link to="/driver/orders" style={styles.link}>
              Assigned Orders
            </Link>
          </>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" style={styles.link}>
              Admin Dashboard
            </Link>
            <Link to="/admin/users" style={styles.link}>
              Users
            </Link>
            <Link to="/admin/vehicles" style={styles.link}>
              Vehicles
            </Link>
          </>
        )}

        {/* LOGOUT */}
        {user && (
          <button onClick={logout} style={styles.btn}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#111",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
  },
  btn: {
    padding: "5px 10px",
    cursor: "pointer",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};
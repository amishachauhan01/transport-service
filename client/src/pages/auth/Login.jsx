import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data);

      const user = res.data.user;
      const token = res.data.token;

      console.log("USER:", user);
      console.log("TOKEN:", token);

      if (!token || !user) {
        alert("Login failed: invalid response");
        return;
      }

      // ✅ SAVE AUTH IN CONTEXT
      login(user, token);

      // ⭐ ADD THIS LINE (IMPORTANT)
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      // ROLE BASED REDIRECT
      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "driver") {
          navigate("/driver");
        } else {
          navigate("/user");
        }
      }, 100);

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      alert(
        error.response?.data?.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "../../utils/parseApiError";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError("");
    setFieldErrors([]);

    try {
      const res = await API.post("/auth/register", form);

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      const { message, fields } = parseApiError(error);
      setSubmitError(message);
      setFieldErrors(fields);
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        {fieldErrors.length > 0 && (
          <ul style={{ color: "red", paddingLeft: "20px" }}>
            {fieldErrors.map((error) => (
              <li key={`${error.field}-${error.message}`}>
                {error.field}: {error.message}
              </li>
            ))}
          </ul>
        )}

        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
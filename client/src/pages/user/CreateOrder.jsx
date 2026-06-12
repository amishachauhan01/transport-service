import { useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { parseApiError } from "../../utils/parseApiError";

export default function CreateOrder() {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  const [form, setForm] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    productName: "",
    weight: "",
  });

  const [signature, setSignature] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSubmitError("");
      setFieldErrors([]);

      // ✅ MUST USE FormData
      const formData = new FormData();

      formData.append("pickupLocation", form.pickupLocation);
      formData.append("deliveryLocation", form.deliveryLocation);
      formData.append("productName", form.productName);
      formData.append("weight", form.weight);

      // ⚠️ IMPORTANT: file only if selected
      if (signature) {
        formData.append("signature", signature);
      }

      console.log("SENDING DATA:", [...formData]);

      const res = await API.post("/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Order Created Successfully 🚀");
      navigate("/user/orders");

    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      const { message, fields } = parseApiError(error);
      setSubmitError(message);
      setFieldErrors(fields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Order</h2>

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

        <input
          name="pickupLocation"
          placeholder="Pickup Location"
          value={form.pickupLocation}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="deliveryLocation"
          placeholder="Delivery Location"
          value={form.deliveryLocation}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="productName"
          placeholder="Product Name"
          value={form.productName}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="weight"
          type="number"
          placeholder="Weight"
          value={form.weight}
          onChange={handleChange}
          required
        />
        <br /><br />

        {/* SIGNATURE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSignature(e.target.files[0])}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Order"}
        </button>
      </form>
    </div>
  );
}
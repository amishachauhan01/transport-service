import { useState } from "react";
import API from "../../api/axios";

export default function SignatureUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Select signature first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("signature", file);

      const res = await API.post(
        "/auth/upload-signature",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Signature uploaded successfully");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Signature</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          padding: "10px 15px",
          cursor: "pointer",
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
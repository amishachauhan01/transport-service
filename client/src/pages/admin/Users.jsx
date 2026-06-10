import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Users</h2>

      {users.map((u) => (
        <div
          key={u._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <p><b>Name:</b> {u.name}</p>
          <p><b>Email:</b> {u.email}</p>
          <p><b>Role:</b> {u.role}</p>
        </div>
      ))}
    </div>
  );
}
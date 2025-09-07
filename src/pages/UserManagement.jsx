/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

const demoUsers = [
  { id: 1, name: "Alice", role: "student" },
  { id: 2, name: "Bob", role: "admin" },
  { id: 3, name: "Charlie", role: "instructor" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(demoUsers);

  function handleRoleChange(id, newRole) {
    setUsers(users =>
      users.map(user =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  }

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>User Management</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
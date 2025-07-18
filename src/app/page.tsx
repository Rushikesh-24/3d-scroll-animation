"use client";
import { useState } from "react";
import { useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ email: "", name: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "An error occurred.");
      } else {
        alert(data.message || "User created successfully!");
        setForm({ email: "", name: "" });
        fetchUsers();
      }
      console.log(data.message)
    } catch {
      alert("An error occurred while submitting the form.");
    }
  };
  const [users, setUsers] = useState<{
    columns: string[];
    rows: (string | number)[][];
  } | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user");
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setUsers(null);
      } else {
        setUsers(data.users);
      }
    } catch {
      alert("An error occurred while fetching users.");
      setUsers(null);
    }
  };

  const deleteUser = async (id: number) => {
            if (
              window.confirm(
                "Are you sure you want to delete this user?"
              )
            ) {
              try {
                const res = await fetch("/api/user", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
                });
                const data = await res.json();
                alert(data.message);
                if (res.ok) fetchUsers();
              } catch {
                alert("An error occurred while deleting the user.");
              }
            }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-around min-h-screen p-4  w-full">
      {/* Form Section */}
      <div className="w-full max-w-sm">
        <form
          className="flex flex-col gap-4 w-full mb-6"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            required
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border rounded px-3 py-2"
            required
            value={form.name}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
        <button
          onClick={fetchUsers}
          className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 mb-4 w-full"
        >
          Refresh Users
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-md mt-6 lg:mt-0">
        {users && (
          <table className="border-collapse border w-full">
        <thead>
          <tr>
            {users.columns.map((col) => (
          <th
            key={col}
            className="border px-3 py-2 bg-gray-100 text-black text-left"
          >
            {col}
          </th>
            ))}
            <th className="border px-3 py-2 bg-gray-100 text-black text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.rows.map((row, idx) => (
            <tr key={idx}>
          {row.map((cell: string | number, i: number) => (
            <td key={i} className="border px-3 py-2">
              {cell}
            </td>
          ))}
          <td className="border px-3 py-2">
            <button
              className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
              onClick={()=> deleteUser(Number(row[0]))}
            >
              Delete
            </button>
          </td>
            </tr>
          ))}
        </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

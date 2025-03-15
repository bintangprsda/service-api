"use client";

import { useState } from "react";

export default function AddHospitalPage() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const response = await fetch("http://localhost:3001/hospitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, address }),
    });

    if (response.ok) {
      setMessage("Hospital berhasil ditambahkan!");
      setId("");
      setName("");
      setAddress("");
    } else {
      setMessage("Gagal menambahkan hospital.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">Tambah Hospital</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Nama Rumah Sakit"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Alamat"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Tambah
        </button>
      </form>
    </div>
  );
}

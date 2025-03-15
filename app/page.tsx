"use client";

import { useEffect, useState } from "react";

// ✅ Definisikan tipe data untuk rumah sakit
interface Hospital {
  id: string;
  name: string;
  address: string;
}

// ✅ Ambil URL API dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch data rumah sakit (GET)
  useEffect(() => {
    async function fetchHospitals() {
      try {
        const res = await fetch(`${API_URL}/hospitals`);
        if (!res.ok) throw new Error("Gagal mengambil data rumah sakit.");
        const data: Hospital[] = await res.json();
        setHospitals(data);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Terjadi kesalahan."
        );
      }
    }
    fetchHospitals();
  }, []);

  // ✅ Handle tambah rumah sakit (POST)
  const handleAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return alert("Nama dan alamat harus diisi!");

    try {
      const response = await fetch(`${API_URL}/hospitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });

      if (!response.ok) throw new Error("Gagal menambahkan rumah sakit.");
      const newHospital: Hospital = await response.json();
      setHospitals((prev) => [...prev, newHospital]);
      setName("");
      setAddress("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  };

  // ✅ Handle update rumah sakit (PUT)
  const handleUpdateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !name || !address) return alert("Semua field harus diisi!");

    try {
      const response = await fetch(`${API_URL}/hospitals/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });

      if (!response.ok) throw new Error("Gagal mengupdate rumah sakit.");
      setHospitals((prev) =>
        prev.map((hospital) =>
          hospital.id === editId ? { ...hospital, name, address } : hospital
        )
      );
      setEditId(null);
      setName("");
      setAddress("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  };

  // ✅ Handle hapus rumah sakit (DELETE)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus rumah sakit ini?"))
      return;

    try {
      const response = await fetch(`${API_URL}/hospitals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus rumah sakit.");
      setHospitals((prev) => prev.filter((hospital) => hospital.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-xl font-bold mb-4">
        {editId ? "Edit Hospital" : "Tambah Hospital"}
      </h2>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form
        onSubmit={editId ? handleUpdateHospital : handleAddHospital}
        className="flex flex-col gap-3"
      >
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
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Daftar Rumah Sakit</h2>
      <div className="mt-4 space-y-3">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="border p-4 rounded-lg shadow">
            <h3 className="font-bold">{hospital.name}</h3>
            <p>{hospital.address}</p>
            <button
              className="text-blue-500 underline mr-2"
              onClick={() => {
                setEditId(hospital.id);
                setName(hospital.name);
                setAddress(hospital.address);
              }}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(hospital.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TrafficData {
    id: number; // Tambahkan ID untuk penghapusan
    polda: string;
    nama_cctv: string;
    status_cctv: string;
    ctddate: string;
    jam: string;
    motor: number;
    minibus: number;
    truck: number;
    bus: number;
    jumlah_total: number;
}

const CardList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrafficData[]>([]);
    const [statusCctv, setStatusCctv] = useState<string>("OUT"); // Status CCTV yang akan digunakan

    const fetchData = async (status: string) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:15000/traffics-cte?status_cctv=${status}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result.data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(statusCctv);
    }, [statusCctv]);

    const toggleStatus = () => {
        setStatusCctv(prevStatus => (prevStatus === "OUT" ? "IN" : "OUT"));
    };

    const deleteTrafficData = async (id: number) => {
        const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:15000/traffics/${id}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    fetchData(statusCctv); // Refresh data setelah penghapusan
                } else {
                    alert("Gagal menghapus data");
                }
            } catch (error) {
                alert("Terjadi kesalahan saat menghapus data");
            }
        }
    };

    if (loading) return <h3 className="text-sm font-medium text-gray-900">Loading</h3>;
    if (error) return <h3 className="text-red-500">Error: {error}</h3>;

    return (
        <>
            <div className="mb-4">
                <button
                    onClick={toggleStatus}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Toggle Status CCTV: {statusCctv}
                </button>
                <Link href="/app/traffics/page" className="ml-4 px-4 py-2 bg-green-500 text-white rounded">
                    Lihat Data Traffic
                </Link>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Polda</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama CCTV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status CCTV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minibus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.polda}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nama_cctv}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status_cctv}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ctddate.split("T")[0]}</td> {/* Hanya ambil tanggal */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jam}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.motor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minibus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.truck}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlah_total}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                                onClick={() => deleteTrafficData(item.id)} // Panggil fungsi hapus
                                className="text-red-500 hover:text-red-700"
                            >
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default CardList;

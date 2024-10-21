// pages/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Menu from "@/components/Menu";
import Header from "@/components/Header";

interface TrafficData {
    id: number; // ID untuk penghapusan
    channel_name: string;
    channel_id: string;
    car_type: string;
    jml: string;
    ctddate: string;
    ctdtime: string;
}

const TrafficList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<TrafficData[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:15000/traffics");
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
        fetchData();
    }, []);

    const deleteTrafficData = async (id: number) => {
        const confirmed = confirm("Apakah Anda yakin ingin menghapus data ini?");
        if (confirmed) {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJzY29wZSI6WyJsaXN0LnJlYWQiXSwiaWQiOiJ0ZXN0In0.YM46eU_hVguvEWvwrASzHm5CfbV8YJgH9obegbbKzGw';
            // const token = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJzY29wZSI6WyJsaXN0LnJlYWQiXSwiaWQiOiJ0ZXN0In0asdas'
            try {
                const response = await fetch(`http://localhost:15000/traffics/${id}`, {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    fetchData(); // Refresh data setelah penghapusan
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
            <main className="container">
                <div className="container w-full max-w-screen-xl justify-center items-center h-screen pt-8">
                    <div className="flex flex-wrap max-h-41">
                        <div className="w-full h-full md:w-1/4 flex justify-center items-center">
                        </div>
                        <div className="w-full md:w-3/4 mt-8">
                        </div>
                    </div>
                    <div aria-label="content" className="mt-9 grid gap-2.5">
                        <h2 className="text-neutral-800	 text-xl font-bold mb-4">List Traffic</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.channel_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.channel_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.car_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jml}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ctddate.split("T")[0]}</td>
                                    {/* Hanya ambil tanggal */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ctdtime}</td>
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
                    </div>
                </div>
            </main>
        </>
    );
};

export default TrafficList;

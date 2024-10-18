"use client";

import React, { useEffect, useState } from "react";
import Menu from "../component";

interface TrafficData {
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:15000/traffics-cte?status_cctv=${statusCctv}`);
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

        fetchData();
    }, [statusCctv]);

    const toggleStatus = () => {
        setStatusCctv(prevStatus => (prevStatus === "OUT" ? "IN" : "OUT")); // Toggle statusCctv
    };

    if (loading) return <h3 className="text-sm font-medium text-gray-900">Loading</h3>;
    if (error) return <h3 className="text-red-500">Error: {error}</h3>;



    return (
        <>
            {/*<Header />*/}
            {/*<Menu />*/}
            <main className="container">
                <div className="container w-full max-w-screen-xl justify-center items-center h-screen pt-8">
                    <div className="flex flex-wrap max-h-41">
                        <div className="w-full h-full md:w-1/4 flex justify-center items-center">
                        </div>
                        <div className="w-full md:w-3/4 mt-8">
                        </div>
                    </div>
                    <div aria-label="content" className="mt-9 grid gap-2.5">
                        <CardList></CardList>
                    </div>
                </div>
            <div className="mb-4">
                <button
                    onClick={toggleStatus}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Toggle Status CCTV: {statusCctv}
                </button>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Polda</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                        CCTV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                        CCTV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minibus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah
                        Total
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.polda}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nama_cctv}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status_cctv}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.ctddate.split("T")[0]}</td>
                        {/* Hanya ambil tanggal */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jam}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.motor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minibus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.truck}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.bus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlah_total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </main>

            </>
            );
};
export default CardList;
// components/Menu.tsx
import React from "react";
import Link from "next/link";

const Menu: React.FC = () => {
    return (
        <nav className="mb-4">
            <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded mr-2">
                Home
            </Link>
            <Link href="/traffics" className="px-4 py-2 bg-green-500 text-white rounded">
                List Traffic
            </Link>
        </nav>
    );
};

export default Menu;
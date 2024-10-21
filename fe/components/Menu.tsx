import React from 'react';
import Link from 'next/link';

const Menu: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white py-2 px-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/traffics">List Traffic</Link>
                </li>
                <li>
                    <Link href="/streams">RTSP Test</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Menu;

// components/Card.tsx
import React from 'react';

interface CardProps {
    title: string;
    description: string;
}

const Card: React.FC<CardProps> = ({ title, description }) => {
    return (
        <div className="p-4 border rounded-md shadow">
            <h2 className="font-bold">{title}</h2>
            <p>{description}</p>
        </div>
    );
};

export default Card;

import React from 'react';

const locations = [
    { id: 1, lat: '-7.7896205', long: '110.3630185', name: 'Stasiun Tugu' },
    { id: 2, lat: '-7.7898668', long: '110.3620978', name: 'Pasar Kembang' },
];

// @ts-ignore
const LocationSelector = ({ onSelect }) => {
    return (
        <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">Select Location:</label>
            <select
                onChange={(e) => {
                    const selectedLocation = locations.find(location => location.id === Number(e.target.value));
                    onSelect(selectedLocation);
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                <option value="" disabled>-- Select a Location --</option>
                {locations.map(location => (
                    <option key={location.id} value={location.id}>
                        {location.name}  {location.lat}, {location.long}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocationSelector;
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Menu from "@/components/Menu";
import Header from "@/components/Header";
import StreamButton from '../../components/StreamButton';
import LocationSelector from '../../components/LocationSelector';

const coordinates = [
    { label: "Location -7.7898668, 110.3620978", lat: -7.7898668, long: 110.3620978 },
    { label: "Location -7.7896205, 110.3630185", lat: -7.7896205, long: 110.3630185 }
];

const StreamPage = () => {
    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [selectedCoordinate, setSelectedCoordinate] = useState(coordinates[0]); // Set default to first location

    const startStream = async (lat: number, long: number) => {
        console.log('Starting stream...');
        if (isStreaming) return;

        const response = await fetch(`http://localhost:5000/start-stream?lat=${lat}&long=${long}`, {
            method: 'POST',
        });

        if (response.ok) {
            setStreamUrl(`http://localhost:5000/streams?lat=${lat}&long=${long}`);
            setIsStreaming(true);
        } else {
            console.error('Failed to start stream');
        }
    };

    const stopStream = useCallback(async () => {
        if (!isStreaming) return;
        const response = await fetch('http://localhost:5000/stop-stream', {
            method: 'POST',
        });

        if (response.ok) {
            setStreamUrl(null);
            setIsStreaming(false);
        } else {
            console.error('Failed to stop stream');
        }
    }, [isStreaming]);

    useEffect(() => {
        return () => {
            if (isStreaming) {
                console.log('Stopping stream on unmount...');
                stopStream();
            }
        };
    }, [isStreaming, stopStream]);

    const handleCoordinateChange = (lat, long) => {
        setSelectedCoordinate({ lat, long });

        if (isStreaming) {
            stopStream().then(() => {
                startStream(lat, long);
            });
        } else {
            startStream(lat, long);
        }
    };

    return (
    <>
        <div className="flex flex-col items-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Live Stream</h1>
            <LocationSelector
                onSelect={({lat, long}) => handleCoordinateChange(lat, long)}
            />
            {streamUrl ? (
                <img src={streamUrl} alt="Live Stream" width="640" height="361"/>
            ) : (
                <p>Stream is not active.</p>
            )}
            <StreamButton
                isStreaming={isStreaming}
                startStream={() => startStream(selectedCoordinate.lat, selectedCoordinate.long)}
                stopStream={stopStream}

            />
        </div>
    </>
    );
};

export default StreamPage;

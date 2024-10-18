import React from 'react';

interface StreamButtonProps {
    isStreaming: boolean;
    startStream: () => Promise<void>;
    stopStream: () => Promise<void>;
}

const StreamButton: React.FC<StreamButtonProps> = ({ isStreaming, startStream, stopStream }) => {
    return (
        <button
            className={`mt-4 px-4 py-2 rounded ${isStreaming ? 'bg-blue-500' : 'bg-green-500'} text-white`}
            onClick={isStreaming ? stopStream : startStream}
        >
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
        </button>
    );
};

export default StreamButton;

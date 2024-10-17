import React from "react";
import "./DataBlock.css";

class DataBlock {
    fileName: string;

    constructor(fileName = "untitled") {
        this.fileName = fileName;
    }

    getName(): string {
        return this.fileName;
    }
}

interface DataBlockProps {
    x: number; // X coordinate position as prop
    y: number; // Y coordinate position as prop
    state?: "occupied" | "empty"; // Optional prop to indicate state
    fileName?: string; // Optional prop to provide a file name
}

const DataBlockComponent: React.FC<DataBlockProps> = ({ x, y, state = "occupied", fileName = "untitled" }) => {
    const dataBlock = new DataBlock(fileName);

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent) => {
        console.log("File dropped");
    };

    return (
        <div
            className={`file-block ${state}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                position: "absolute", // Absolute positioning to allow custom placement
                left: `${x}px`,
                top: `${y}px`,
            }}
        >
            {state === "occupied" ? (
                <p>{dataBlock.getName()}</p>
            ) : (
                <p>Drop a file here</p>
            )}
        </div>
    );
};

export default DataBlockComponent;
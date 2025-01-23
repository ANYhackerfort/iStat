import React from "react";
import "./styleBlocks.css"
interface OutputToCsvProps {
  csvData: string; // CSV data as a string
  fileName: string; // Name of the file to download
}

const OutputToCsv: React.FC<OutputToCsvProps> = ({ csvData, fileName }) => {
  const handleDownload = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event)
    event.stopPropagation(); // Prevent click event from bubbling to parent elements
    console.log("Downloading CSV...");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="csv-download"
    >
      <button onClick={handleDownload}>Download CSV</button>
    </div>
  );
};

export default OutputToCsv;

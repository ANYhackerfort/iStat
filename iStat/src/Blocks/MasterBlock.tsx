import React, { useState, useEffect, useRef } from 'react';
import './MasterBlock.css';
import Ghost from '../Misc/ghostObj.tsx/mainGhost';
import CleanNaBlock from './simpleBlockDisplays/cleanNaBlock';
import OutputToCsv from './simpleBlockDisplays/outputToCSV';

interface Nodes {
  id: number;
  type: string;
  numberInputs: number;
  numberOutputs: number;
  x: number;
  y: number;
  selected: boolean;
  neighbors: Nodes[]; // Refers to the same Nodes interface (outputs)
}

interface MasterNodeProps {
  id: number;
  x: number;
  y: number;
  numberInputs: number;
  numberOutputs: number;
  selected: boolean;
  handleNodeDown: (id: number, event: React.MouseEvent) => void;  
  updateNodePlace: (id: number, changeX: number, changeY: number) => void;
  handleMouseDownOutput: (id: number, outputIndex: number, numberOutputs: number, event: React.MouseEvent) => void;
  handleMouseEnterInput?: (id: number, inputIndex: number, numberInputs: number, event: React.MouseEvent) => void; 
  dragAndDrop?: boolean; // Enable drag-and-drop feature for the node
  type: string;
}

const MasterNode: React.FC<MasterNodeProps> = ({ 
  id, 
  x, 
  y, 
  numberInputs, 
  numberOutputs, 
  selected = false, 
  handleNodeDown, 
  updateNodePlace, 
  handleMouseDownOutput, 
  handleMouseEnterInput, 
  dragAndDrop = false,
  type,
}) => {

  const [positionNode, setPositionNode] = useState({ xPos: x, yPos: y });
  const positionNodeRef = useRef({ xPos: x, yPos: y });
  const isDragging = useRef(false);
  const stepPosition = useRef({ XPos: 0, YPos: 0 });
  const [hide, setHide] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragAndDrop) return;
    event.preventDefault();
  };

  const handleUpload = async (uploadFile: File | null) => {
    if (!uploadFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await fetch("http://localhost:3000/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Uploaded CSV content:", result);
      } else {
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    if (!dragAndDrop) return;
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      console.log(file)
      setFileName(file.name);
      handleUpload(file);
    }
  };

  const inputs = numberInputs > 0 && Array.from({ length: numberInputs }, (_, index) => (
    <div 
      key={index} 
      className="input"
      onMouseEnter={(event) => {
        if (handleMouseEnterInput) {
          event.stopPropagation(); 
          handleMouseEnterInput(id, index, numberInputs, event); 
        }
      }} 
    ></div>
  ));

  const outputs = Array.from({ length: numberOutputs }, (_, index) => (
    <div 
      key={index} 
      className="output"
      onMouseDown={(event) => {
        event.stopPropagation(); 
        handleMouseDownOutput(id, index, numberOutputs, event); 
      }} 
    ></div>
  ));

  const handleMouseDown = (event: React.MouseEvent) => {
    if (
      (event.target as HTMLElement).tagName === "BUTTON" ||
      (event.target as HTMLElement).classList.contains("csv-download")
    ) {
      return; // Do nothing, let the button handle the event
    }
    if (event.button !== 0) return;
    isDragging.current = true;
    stepPosition.current.XPos = event.clientX;
    stepPosition.current.YPos = event.clientY;
    handleNodeDown(id, event);
    setHide(true); // Hide the node when dragging
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
        if (isDragging.current) {
            const changeX = event.clientX - stepPosition.current.XPos;
            const changeY = event.clientY - stepPosition.current.YPos;

            stepPosition.current.XPos = event.clientX;
            stepPosition.current.YPos = event.clientY;

            positionNodeRef.current.xPos += changeX;
            positionNodeRef.current.yPos += changeY;

            setPositionNode({
                xPos: positionNodeRef.current.xPos,
                yPos: positionNodeRef.current.yPos,
            });
        }
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        updateNodePlace(id, positionNodeRef.current.xPos, positionNodeRef.current.yPos);
        setHide(false); // Show the node after dragging ends
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, updateNodePlace]);

  return (
    <div>
      <Ghost 
        visible={hide} 
        xPos={positionNode.xPos} 
        yPos={positionNode.yPos} 
        content={
          <div className={`master-node ${selected ? 'selected' : ''}`}>
            {dragAndDrop ? (
              <>
                <div className="inputsWrapper">{inputs}</div>
                <div className="outputsWrapper">{outputs}</div>
                <div className="drag-area">
                  {fileName ? <p>{fileName}</p> : <p>Drag and drop a file here</p>}
                </div>
              </>
            ) : (
              <>
                <div className="inputsWrapper">{inputs}</div>
                <div className="outputsWrapper">{outputs}</div>
              </>
            )}
          </div>
        }
      />
      <div
      className={`master-node ${selected ? 'selected' : ''} ${hide ? 'hidden' : ''}`}
      style={{ transform: `translate(${positionNode.xPos}px, ${positionNode.yPos}px)` }}
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {type === 'data-cleaning-block-remove-null' ? (
        <>
          <div className="inputsWrapper">{inputs}</div>
          <div className="outputsWrapper">{outputs}</div>
          <CleanNaBlock />
        </>
      ) : type === 'data-block-csv' ? (
        <>
          <div className="inputsWrapper">{inputs}</div>
          <div className="outputsWrapper">{outputs}</div>
          <div className="drag-area">
            {fileName ? <p>{fileName}</p> : <p>Drag and drop a file here</p>}
          </div>
        </>
      ) : type === 'output-to-csv' ? (
        <>
          <div className="inputsWrapper">{inputs}</div>
          <div className="outputsWrapper">{outputs}</div>
          <div
            className="csv-download"
            onClick={(e) => e?.stopPropagation()} // Prevent bubbling to parent
          >
            <OutputToCsv csvData="col1,col2\nvalue1,value2" fileName='test'/>
          </div>
        </>
      ) : (
        <>
          <div className="inputsWrapper">{inputs}</div>
          <div className="outputsWrapper">{outputs}</div>
        </>
      )}
      </div>
    </div>
  );
};

export default MasterNode;

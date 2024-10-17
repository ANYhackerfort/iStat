import React, { useState, useEffect, useRef } from 'react';
import './MasterBlock.css';
import Ghost from '../Misc/ghostObj.tsx/mainGhost';

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
  neighbors: Nodes[]; 
  handleMouseDownOutput: (id: number, outputIndex: number, numberOutputs: number, event: React.MouseEvent) => void;
  handleMouseEnterInput: (id: number, inputIndex: number, numberInputs: number, event: React.MouseEvent) => void; 
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
  neighbors, 
  handleMouseDownOutput, 
  handleMouseEnterInput 
}) => {

  const [positionNode, setPositionNode] = useState({ xPos: x, yPos: y });
  const positionNodeRef = useRef({ xPos: x, yPos: y });
  const isDragging = useRef(false);
  const stepPosition = useRef({ XPos: 0, YPos: 0 });
  const [hide, setHide] = useState<boolean>(false);

  const inputs = Array.from({ length: numberInputs }, (_, index) => (
    <div 
      key={index} 
      className="input"
      onMouseEnter={(event) => {
        event.stopPropagation(); 
        handleMouseEnterInput(id, index, numberInputs, event); 
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
    if (event.button !== 0) return;
    console.log("position of node", positionNode.xPos, positionNode.yPos)
    isDragging.current = true;
    stepPosition.current.XPos = event.clientX;
    stepPosition.current.YPos = event.clientY;
    event.stopPropagation();
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
      <Ghost visible={hide} xPos={positionNode.xPos} yPos={positionNode.yPos} />
      <div 
        className={`master-node ${selected ? 'selected' : ''} ${hide ? 'hidden' : ''}`}
        style={{ transform: `translate(${positionNode.xPos}px, ${positionNode.yPos}px)` }}
        onMouseDown={handleMouseDown} 
      >
        <div className="inputsWrapper">
          {inputs}
        </div>

        <div className="outputsWrapper">
          {outputs}
        </div>
      </div>
    </div>
  );
};

export default MasterNode;
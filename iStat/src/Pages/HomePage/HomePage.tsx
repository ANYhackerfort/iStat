import React, { useState, useEffect, useRef } from 'react';
import Canvas from '../CanvasPage/CanvasPage';
import Toolbar from '../../Misc/Toolbar/Toolbar';
import MasterNode from '../../Blocks/MasterBlock';
import LineComponent from '../../Misc/edges/Edge';

interface Lines {
  start: { x: number; y: number };
  end: { x: number; y: number };
  type: boolean; // true for output, false for input
}

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

const HomePage: React.FC = () => {
  const [nodes, setNodes] = useState<{ [key: number]: Nodes }>({});
  const [lines, setLines] = useState<Lines[][]>([]);
  const [nodeType, setNodeType] = useState<string | null>(null);


  const selectedNode = useRef<number | null>(null);
  const count = useRef(0);

  const nodeOfOutputEdge = useRef(0);
  const nodeOfInputEdge = useRef(0);
  const nodeOfOutputEdgePosition = useRef({ positionX: 0, positionY: 0 });
  const nodeOfInputEdgePosition = useRef({ positionX: 0, positionY: 0 });

  //the inputs and output number from the top to bottom. 
  const inputsNumber = useRef(0);
  const outputsNumber = useRef(0); 
  const lineUpdate = useRef({ changeX: 0, changeY: 0 }); 

  const handleMouseDownNode = (id: number, event: React.MouseEvent) => {
    if (event.button !== 0) return;
    selectedNode.current = id;
  };

  const handleNodeIconClicked = (id: string) => {
    setNodeType(id);
  };

  const updateNodePlace = (nodeId: number, changeX: number, changeY: number) => {
    setNodes((prevNodes) => {
      const updatedNodes = { ...prevNodes };
      let changeInPositionX = 0;
      let changeInPositionY = 0;

      if (updatedNodes[nodeId]) {
        changeInPositionX = changeX - updatedNodes[nodeId].x;
        changeInPositionY = changeY - updatedNodes[nodeId].y;

        updatedNodes[nodeId] = {
          ...updatedNodes[nodeId],
          x: changeX,
          y: changeY,
        };

        setLines((prevLines) => {
          const updatedLines = [...prevLines];
          if (updatedLines[nodeId - 1]) {
            updatedLines[nodeId - 1] = updatedLines[nodeId - 1].map((line) => {
              if (!line) {
                return line; 
              }
              const updatedLine = { ...line };
              if (updatedLine.type === true) {
                updatedLine.start.x += changeInPositionX;
                updatedLine.start.y += changeInPositionY;
              } else {
                updatedLine.end.x += changeInPositionX;
                updatedLine.end.y += changeInPositionY;
              }
              return updatedLine;
            });
          }
          return updatedLines;
        });
      }
      return updatedNodes;
    });
  };

  const handleMouseDownOutput = (id: number, outputIndex: number, numberOfOutputs: number, event: React.MouseEvent): void => {
    console.log(outputIndex)
    nodeOfOutputEdge.current = id;
    outputsNumber.current = outputIndex; 
    nodeOfOutputEdgePosition.current = {
      positionX: event.clientX,
      positionY: event.clientY,
    };
  };

  const handleMouseEnterInput = (id: number, inputIndex: number, numberOfInputs: number, event: React.MouseEvent): void => {
    nodeOfInputEdge.current = id;
    inputsNumber.current = inputIndex; 
    nodeOfInputEdgePosition.current = {
      positionX: event.clientX,
      positionY: event.clientY,
    };
  };

  const addNode = (type: string, x: number, y: number) => {
    count.current += 1;
    const newNode: Nodes = {
      id: count.current,
      type: type,
      numberInputs: 2,
      numberOutputs: 1,
      x: x - 100,
      y: y - 80,
      selected: false,
      neighbors: [],
    };

    setNodes((prevNodes) => ({
      ...prevNodes,
      [newNode.id]: newNode,
    }));

    setNodeType(null);
  };

  const updateConnectionNodes = (changeX: number, changeY: number) => {
    lineUpdate.current.changeX = changeX;
    lineUpdate.current.changeY = changeY; 
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (event.button !== 0) return;
    const outputEdgeId = nodeOfOutputEdge.current; //these are the id of the nodes，we want to log how many inputs and outputs there are. 
    const inputEdgeId = nodeOfInputEdge.current;

    if (inputEdgeId !== 0 && outputEdgeId !== 0) {
      setNodes((prevNodes) => {
        const updatedNodes = { ...prevNodes };
          setLines((prevLines) => {
            const start = {
              x: nodeOfOutputEdgePosition.current.positionX - lineUpdate.current.changeX,
              y: nodeOfOutputEdgePosition.current.positionY - lineUpdate.current.changeY,
            };
            const end = {
              x: nodeOfInputEdgePosition.current.positionX - lineUpdate.current.changeX,
              y: nodeOfInputEdgePosition.current.positionY - lineUpdate.current.changeY,
            };
  
            const updatedLines = [...prevLines];
            
            const numOutputs = updatedNodes[outputEdgeId].numberOutputs; 
            const numInputs =  updatedNodes[outputEdgeId].numberInputs; 
            const totalNum = numOutputs + numInputs; 
            
            if (!updatedLines[outputEdgeId - 1]) {
              updatedLines[outputEdgeId - 1] = new Array(totalNum).fill(null);
            }
            if (!updatedLines[inputEdgeId - 1]) {
              updatedLines[inputEdgeId - 1] = new Array(totalNum).fill(null);
            }
            console.log(outputEdgeId - 1, outputEdgeId - 1)
            console.log(updatedLines[outputEdgeId - 1][outputsNumber.current], updatedLines[inputEdgeId - 1][inputsNumber.current])
            if (updatedLines[outputEdgeId - 1][outputsNumber.current] === null && updatedLines[inputEdgeId - 1][numOutputs + inputsNumber.current] === null) { //ouputs appear first, inputs appear second 
              updatedLines[outputEdgeId - 1][outputsNumber.current] = { start, end, type: true };
              updatedLines[inputEdgeId - 1][numOutputs + inputsNumber.current] = {start, end, type: false };
            } 

            return updatedLines;
          });

        if (updatedNodes[outputEdgeId]) {
          const updatedNeighbors = [
            ...updatedNodes[outputEdgeId].neighbors,
            updatedNodes[inputEdgeId],
          ];

          updatedNodes[outputEdgeId] = {
            ...updatedNodes[outputEdgeId],
            neighbors: updatedNeighbors,
          };
        }

        return updatedNodes;
      });
    }

    nodeOfOutputEdge.current = 0;
    nodeOfInputEdge.current = 0;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div>
      <Toolbar nodeIconClicked={handleNodeIconClicked} />
      <Canvas nodeType={nodeType} addToCanvas={addNode} updateConnectionPositions={updateConnectionNodes}>
        {Object.values(nodes).map((node) => (
          <MasterNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            numberInputs={node.numberInputs}
            numberOutputs={node.numberOutputs}
            selected={node.selected}
            handleNodeDown={handleMouseDownNode}
            updateNodePlace={updateNodePlace}
            handleMouseDownOutput={handleMouseDownOutput}
            handleMouseEnterInput={handleMouseEnterInput}
            neighbors={node.neighbors}
          />
        ))}
        {lines.map((nodeLines, nodeIndex) => (
          <div key={nodeIndex}>
            {nodeLines && nodeLines.map((line, lineIndex) => (
              line && line.start && line.end ? (
                <LineComponent key={lineIndex} start={line.start} end={line.end} />
              ) : null // Skip rendering if line is null or missing start/end
            ))}
          </div>
        ))}
      </Canvas>
    </div>
  );
};

export default HomePage;
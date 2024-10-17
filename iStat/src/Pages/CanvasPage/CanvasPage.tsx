import React, { useEffect, useRef, useState, ReactNode } from "react";
import "./CanvasPage.css"; 
import Toolbar from "../../Misc/Toolbar/Toolbar";
import Ghost from "../../Misc/ghostObj.tsx/mainGhost";

interface CanvasProps {
    children?: ReactNode; // Allow other components to be passed as children
    nodeType: string | null;  // Define the type of node to add
    addToCanvas: (type: string, x: number, y: number) => void; // Function to add a node to the canvas
    updateConnectionPositions: (x: number, y: number) => void; 
}

const Canvas: React.FC<CanvasProps> = ({ children, nodeType, addToCanvas, updateConnectionPositions }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);  
    const scaleRef = useRef(1); 
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const delta = useRef({ deltaX: 0, deltaY: 0 });
    const movementAllowedCursor = useRef(true);
    const centerChords = useRef({ centerX: 0, centerY: 0 });
    const isDragging = useRef(false); 
    const stepPosition = useRef({ XPos: 0, YPos: 0 });
    const ended = useRef(false); 
    const volume = useRef(0);
    const [isPanning, setIsPanning] = useState(false);
    const quickCenter = useRef(0); //optional feature
    const iconAdding = useRef(false); 
    const [ghostPosition, setGhostPosition] = useState({ ghostX: 0, ghostY: 0}); 

    useEffect(() => {
        if (nodeType !== null) {
            iconAdding.current = true;
            console.log("Adding node of type:", nodeType);
            // addToCanvas(nodeType); 
        }
    }, [nodeType, addToCanvas]);

    const updateCenterChords = () => {
        const canvasElement = containerRef.current;
        
        if (canvasElement) {
            const rect = canvasElement.getBoundingClientRect();
            centerChords.current.centerX = rect.width / 2;
            centerChords.current.centerY = rect.height / 2;
        }
    };

    useEffect(() => {
        updateCenterChords();

        const handleResize = () => {
            updateCenterChords();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); 

    useEffect(() => {
        if(!isPanning) {
            updateConnectionPositions(translate.x, translate.y);
        }
    }, [translate.x, isPanning]);  // This will log the updated value whenever `translate.x` changes

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const canvasElement = containerRef.current;

            if (nodeType !== null && canvasElement) {
                setGhostPosition({ ghostX: event.clientY, ghostY: event.clientX });
                return; 
            }

            if (canvasElement) {
                const rect = canvasElement.getBoundingClientRect();

                const x = (event.clientX - rect.left) / scaleRef.current;
                const y = (event.clientY - rect.top) / scaleRef.current; 

                if (x < 0 || y < 0) {
                    movementAllowedCursor.current = false;
                } else {
                    movementAllowedCursor.current = true;
                }

                const deltaX = (x - centerChords.current.centerX);
                const deltaY = (y - centerChords.current.centerY);

                delta.current.deltaX = deltaX;
                delta.current.deltaY = deltaY;
            }

            if (isDragging.current) {
                setTranslate((prevTranslate) => {
                    let newTranslateX = prevTranslate.x;
                    let newTranslateY = prevTranslate.y;
                    
                    newTranslateX += (event.clientX - stepPosition.current.XPos);
                    newTranslateY += (event.clientY - stepPosition.current.YPos); 

                    stepPosition.current.XPos = event.clientX;
                    stepPosition.current.YPos = event.clientY;

                    return {
                        x: newTranslateX,
                        y: newTranslateY,
                    };
                });
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            isDragging.current = true;
            stepPosition.current.XPos = event.clientX;
            stepPosition.current.YPos = event.clientY;
            setIsPanning(true);
        };

        const handleMouseUp = (event: MouseEvent) => {
            console.log(translate.x, translate.y)
            const canvasElement = containerRef.current;
            if (nodeType !== null && canvasElement) {
                const rect = canvasElement.getBoundingClientRect();
                
                const x = (event.clientX - rect.left) / scaleRef.current;
                const y = (event.clientY - rect.top) / scaleRef.current; 
                addToCanvas(nodeType, x, y)
                return; 
            }
            isDragging.current = false;
            setIsPanning(false);
        };

        const handleScroll = (event: WheelEvent) => {
            const { deltaX, deltaY } = delta.current;
            const zoomAmount = event.deltaY > 0 ? 0.95 : (1 / 0.95); 

            scaleRef.current = Math.min(Math.max(scaleRef.current * zoomAmount, 1), 2.51753261031);
            setScale((prevScale) => {
                const newScale = prevScale * zoomAmount;
                return Math.min(Math.max(newScale, 1), 2.51753261031); 
            });

            if (movementAllowedCursor.current) {
                setTranslate((prevTranslate) => {
                    const scrollDirection = event.deltaY > 0 ? 1 : -1;
                    let newTranslateX = prevTranslate.x;
                    let newTranslateY = prevTranslate.y;

                    if (scaleRef.current !== 2.51753261031 && scaleRef.current > 0.95) {
                        if (scaleRef.current === 1) {
                            quickCenter.current += 1;
                            if (quickCenter.current === 10) {
                                newTranslateX = 0;
                                newTranslateY = 0;
                                quickCenter.current = 0;
                            }
                        }
                        var scaling = 20 / (scaleRef.current);
                        if (scrollDirection === -1) {
                            newTranslateX -= (deltaX / scaling);
                            newTranslateY -= (deltaY / scaling);
                            ended.current = false;
                            volume.current += 1;
                        } else {
                            scaling = 20 / (scaleRef.current * (1 / 0.95));
                            if (volume.current !== 0){
                                newTranslateX += (deltaX / scaling);
                                newTranslateY += (deltaY / scaling);
                                volume.current -= 1;
                            }
                        }
                    } return {
                        x: newTranslateX,
                        y: newTranslateY,
                    };
                });
            }
        };
        
        window.addEventListener('wheel', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [scale, nodeType]);

    return (
        <div>
            <div
            ref={containerRef}
            className={`dot-background ${isPanning ? 'panning' : ''}`} 
            style={{
                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            }}
        >
            <div className="canvas-children">
                {children}
            </div>
        </div>
            {nodeType !== null && (ghostPosition.ghostX !== 0 || ghostPosition.ghostY !== 0) ? (
            <Ghost visible={true} xPos={ghostPosition.ghostY} yPos={ghostPosition.ghostX} />
            ) : (
            <Ghost visible={false} />
            )}
        </div>
    );
};

export default Canvas;
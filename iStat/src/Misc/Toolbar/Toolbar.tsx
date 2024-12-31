import React, { useState, useEffect, useRef } from 'react';
import './Toolbar.css';
import DataBlockIcon from '../../Blocks/DataBlock/DatablockIcon';
import MainBlockIcon from '../../Blocks/MainIcon';

interface ToolbarProps {
    nodeIconClicked: (type: string) => void;  // Expecting a function to add a node of a certain type
}

const Toolbar: React.FC<ToolbarProps> = ({ nodeIconClicked }) => {
    const [nodePageClicked, setNodePageClicked] = useState(true);  
    const [dataPageClicked, setDataPageClicked] = useState(false);  

    const showNodePage = () => {
        if (!nodePageClicked) {
            setNodePageClicked(true); 
            setDataPageClicked(false); 
        }
    };

    const showDataPage = () => {
        if (!dataPageClicked) {
            setNodePageClicked(false); 
            setDataPageClicked(true); 
        }
    };
    
    const stopPropagation = (event: React.MouseEvent | React.TouchEvent | React.DragEvent) => {
        event.stopPropagation();
    }

    const handleMouseDownIcon = (id: string) => {
        nodeIconClicked(id); 
    };

    return (
        <div 
            className="toolbar" 
            onClick={stopPropagation}
            onDrag={stopPropagation}
            onMouseDown={stopPropagation}
            onWheel={stopPropagation}
        >
            <button 
                className={`toolbar-btn ${nodePageClicked ? 'toolbar-btn-clicked' : ''}`} 
                onClick={showNodePage}
            >
                Nodes
            </button>

            <button 
                className={`toolbar-btn-right ${dataPageClicked ? 'toolbar-btn-right-clicked' : ''}`} 
                onClick={showDataPage}
            >
                Data
            </button>

            <div className="main-block-container">
                <MainBlockIcon 
                    imageSrc='/file.svg' 
                    id="data-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
                <MainBlockIcon 
                    imageSrc='/file.svg' 
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </div>
        </div>
    );
};

export default Toolbar;
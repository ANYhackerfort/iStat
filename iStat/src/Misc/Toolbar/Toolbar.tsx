import React, { useState, useEffect, useRef } from 'react';
import './Toolbar.css';
import DataBlockIcon from '../../Blocks/DataBlock/DatablockIcon';
import MainBlockIcon from '../../Blocks/MainIcon';
import Dropdown from './dropdownmenu';

interface ToolbarProps {
    nodeIconClicked: (type: string) => void;  // Expecting a function to add a node of a certain type
}

const Toolbar: React.FC<ToolbarProps> = ({ nodeIconClicked }) => {
    const [isOpen, setIsOpen] = useState(false);
    
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
            <Dropdown label=".Input"> 
                <MainBlockIcon 
                    id="data-block-csv"
                    text='.CSV File'
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
                <MainBlockIcon 
                    id="data-block-excel"
                    text='.Excel File'
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Data Cleaning">
                <MainBlockIcon 
                    text='Remove NAs'
                    id="data-cleaning-block-remove-null"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>
            

            <Dropdown label=".Join Data">
                <MainBlockIcon 
                    text=''
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Simple Statistics">
                <MainBlockIcon 
                    text=''
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Significance Testings">
                <MainBlockIcon 
                    text=''
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Graphing">
                <MainBlockIcon 
                    text=''
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Ouput as File">
                <MainBlockIcon 
                    text='Download CSV'
                    id="output-to-csv"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>

            <Dropdown label=".Correlation">
                <MainBlockIcon 
                    text=''
                    id="data-cleaning-block-1"
                    handleMouseDownIcon={handleMouseDownIcon} // Pass the handler for mouse down event
                />
            </Dropdown>
    </div>
    );
};

export default Toolbar;